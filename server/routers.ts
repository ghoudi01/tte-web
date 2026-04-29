import { getSessionCookieOptions, getSessionIdFromCookie } from "./_core/cookies";
import {
  router,
  publicProcedure,
  protectedProcedure,
  pluginProcedure,
} from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  createMerchant,
  getMerchantByUserId,
  getMerchantByApiKey,
  updateMerchant,
  getPhoneVerification,
  createOrUpdatePhoneVerification,
  createOrder,
  getOrdersByMerchant,
  updateOrder,
  getAllPlugins,
  getMerchantPlugins,
  installPlugin,
  getDb,
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  getSessionBySessionId,
  deleteSessionBySessionId,
} from "./db";
import { eq, and, desc, sql, gte } from "drizzle-orm";
import { orders } from "./drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { homeContent } from "./config/home-content";
import { appContent } from "./config/app-content";
import {
  getMerchantAutomationConfig,
  updateMerchantAutomationConfig,
} from "./config/merchant-automation";
import { evaluateAutomationDecision } from "./ia/engine";
import {
  decisionEngine,
  verificationPipeline,
  whatsappPipeline,
} from "./ia/ia-system-integration";
import { loadPluginManifests } from "./config/plugins-workspace";
import {
  buildWhatsAppValidationMessage,
  explainTrust,
  selectShippingCarrier,
  getGrowthTips,
} from "./ia/pipelines";

const merchantRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    const merchant = await getMerchantByUserId(ctx.user.id);
    return merchant ?? null;
  }),

  create: protectedProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        city: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const existing = await getMerchantByUserId(ctx.user.id);
      if (existing) throw new Error("Merchant account already exists");
      const apiKey = `tte_${nanoid(32)}`;
      const merchant = await createMerchant({
        userId: ctx.user.id,
        businessName: input.businessName,
        email: input.email,
        phone: input.phone,
        city: input.city,
        address: input.address,
        apiKey,
        country: "Tunisia",
        status: "active",
        subscriptionPlan: "starter",
      });
      return merchant;
    }),

  update: protectedProcedure
    .input(
      z.object({
        businessName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(1).optional(),
        city: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const merchant = await getMerchantByUserId(ctx.user.id);
      if (!merchant) throw new Error("Merchant not found");
      await updateMerchant(merchant.id, input);
      return { success: true };
    }),

  regenerateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    const merchant = await getMerchantByUserId(ctx.user.id);
    if (!merchant) throw new Error("Merchant not found");
    const newApiKey = `tte_${nanoid(32)}`;
    await updateMerchant(merchant.id, { apiKey: newApiKey });
    return { apiKey: newApiKey };
  }),

  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    const merchant = await getMerchantByUserId(ctx.user.id);
    if (!merchant) return null;
    const recentOrders = await getOrdersByMerchant(merchant.id, 10);
    const totalOrders = merchant.totalOrders ?? 0;
    const successfulOrders = merchant.successfulOrders ?? 0;
    const rtoRate = merchant.rtoRate ?? 0;
    const successRate =
      totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const db = await getDb();
    let recentOrdersData: {
      date: string;
      count: number;
      verified: number;
      failed: number;
    }[] = [];
    if (db) {
      const rows = await db
        .select({
          date: sql<string>`DATE(${orders.createdAt})`.as("date"),
          count: sql<number>`COUNT(*)`.as("count"),
          verified:
            sql<number>`SUM(CASE WHEN ${orders.verificationStatus} = 'verified' THEN 1 ELSE 0 END)`.as(
              "verified"
            ),
          failed:
            sql<number>`SUM(CASE WHEN ${orders.verificationStatus} IN ('failed','rejected') THEN 1 ELSE 0 END)`.as(
              "failed"
            ),
        })
        .from(orders)
        .where(
          and(
            eq(orders.merchantId, merchant.id),
            gte(orders.createdAt, sevenDaysAgo)
          )
        )
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);
      recentOrdersData = rows as typeof recentOrdersData;
    }
    return {
      merchant,
      orders: recentOrders,
      analytics: {
        totalOrders,
        successfulOrders,
        successRate,
        rtoRate,
        recentOrdersData,
        regionalDistribution: [
          { region: "Tunis", count: Math.round(totalOrders * 0.4) },
          { region: "Sousse", count: Math.round(totalOrders * 0.2) },
          { region: "Sfax", count: Math.round(totalOrders * 0.15) },
          { region: "Bizerte", count: Math.round(totalOrders * 0.1) },
          { region: "Other", count: Math.round(totalOrders * 0.15) },
        ],
        monthlyGrowth: 12.5, // Mock growth percentage
      },
    };
  }),
});

const phoneVerificationRouter = router({
  check: protectedProcedure
    .input(z.object({ phoneNumber: z.string().min(1) }))
    .query(async ({ input }) => {
      const verification = await getPhoneVerification(input.phoneNumber);
      if (!verification) {
        const newVerification = await createOrUpdatePhoneVerification({
          phoneNumber: input.phoneNumber,
          trustScore: 50,
          isVerified: 0,
          rtoCount: 0,
          successfulOrders: 0,
        });
        return {
          phoneNumber: input.phoneNumber,
          trustScore: 50,
          isVerified: false,
          rtoCount: 0,
          successfulOrders: 0,
          riskLevel: "medium" as const,
        };
      }
      let riskLevel: "low" | "medium" | "high" = "medium";
      const score = verification.trustScore ?? 50;
      if (score >= 70) riskLevel = "low";
      else if (score < 40) riskLevel = "high";
      return {
        phoneNumber: verification.phoneNumber,
        trustScore: verification.trustScore ?? 50,
        isVerified: verification.isVerified === 1,
        rtoCount: verification.rtoCount ?? 0,
        successfulOrders: verification.successfulOrders ?? 0,
        riskLevel,
      };
    }),

  sendOtp: protectedProcedure
    .input(z.object({ phoneNumber: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await createOrUpdatePhoneVerification({
        phoneNumber: input.phoneNumber,
        otp,
        isVerified: 0,
      });
      return {
        success: true,
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }),

  verifyOtp: protectedProcedure
    .input(
      z.object({ phoneNumber: z.string().min(1), otp: z.string().length(6) })
    )
    .mutation(async ({ input }) => {
      const verification = await getPhoneVerification(input.phoneNumber);
      if (!verification || verification.otp !== input.otp)
        throw new Error("Invalid OTP");
      const currentScore = verification.trustScore ?? 50;
      const newTrustScore = Math.min(currentScore + 10, 100);
      await createOrUpdatePhoneVerification({
        phoneNumber: input.phoneNumber,
        otp: null,
        isVerified: 1,
        trustScore: newTrustScore,
        lastVerifiedAt: new Date(),
      });
      return { success: true, verified: true };
    }),
});

const ordersRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        status: z
          .enum(["placed", "shipped", "delivered", "returned", "cancelled"])
          .optional(),
        verificationStatus: z
          .enum(["pending", "verified", "failed", "rejected"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const merchant = await getMerchantByUserId(ctx.user.id);
      if (!merchant) throw new Error("Merchant not found");
      const db = await getDb();
      if (!db) return [];
      const conditions = [eq(orders.merchantId, merchant.id)];
      if (input.status) conditions.push(eq(orders.orderStatus, input.status));
      if (input.verificationStatus)
        conditions.push(
          eq(orders.verificationStatus, input.verificationStatus)
        );
      return db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  create: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1),
        orderAmount: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const merchant = await getMerchantByUserId(ctx.user.id);
      if (!merchant) throw new Error("Merchant not found");
      const verification = await getPhoneVerification(input.phoneNumber);
      const trustScore = verification?.trustScore ?? 50;
      const requiresVerification = trustScore < 50;
      const verificationMethod = requiresVerification ? "sms" : "none";
      const order = await createOrder({
        merchantId: merchant.id,
        phoneNumber: input.phoneNumber,
        orderAmount: input.orderAmount,
        trustScore,
        verificationStatus: requiresVerification ? "pending" : "verified",
        orderStatus: "placed",
        requiresVerification: requiresVerification ? 1 : 0,
        verificationMethod: verificationMethod as
          | "sms"
          | "ivr"
          | "email"
          | "none",
      });
      await updateMerchant(merchant.id, {
        totalOrders: (merchant.totalOrders ?? 0) + 1,
      });
      return { success: true, order };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        orderStatus: z.enum([
          "placed",
          "shipped",
          "delivered",
          "returned",
          "cancelled",
        ]),
        verificationStatus: z
          .enum(["pending", "verified", "failed", "rejected"])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const merchant = await getMerchantByUserId(ctx.user.id);
      if (!merchant) throw new Error("Merchant not found");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [orderRow] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);
      if (!orderRow || orderRow.merchantId !== merchant.id)
        throw new Error("Order not found");
      const updateData: Record<string, unknown> = {
        orderStatus: input.orderStatus,
      };
      if (input.verificationStatus)
        updateData.verificationStatus = input.verificationStatus;
      if (input.orderStatus === "delivered") {
        await updateMerchant(merchant.id, {
          successfulOrders: (merchant.successfulOrders ?? 0) + 1,
        });
        const pv = await getPhoneVerification(orderRow.phoneNumber);
        if (pv) {
          await createOrUpdatePhoneVerification({
            phoneNumber: orderRow.phoneNumber,
            successfulOrders: (pv.successfulOrders ?? 0) + 1,
            trustScore: Math.min((pv.trustScore ?? 50) + 5, 100),
          });
        }
      }
      if (input.orderStatus === "returned") {
        const rtoCount =
          merchant.totalOrders && merchant.totalOrders > 0
            ? Math.round(
                (((merchant.rtoRate ?? 0) * merchant.totalOrders + 1) /
                  (merchant.totalOrders + 1)) *
                  100
              )
            : 100;
        await updateMerchant(merchant.id, { rtoRate: rtoCount });
        const pv = await getPhoneVerification(orderRow.phoneNumber);
        if (pv) {
          await createOrUpdatePhoneVerification({
            phoneNumber: orderRow.phoneNumber,
            rtoCount: (pv.rtoCount ?? 0) + 1,
            trustScore: Math.max((pv.trustScore ?? 50) - 10, 0),
          });
        }
      }
      await updateOrder(
        input.orderId,
        updateData as Parameters<typeof updateOrder>[1]
      );
      return { success: true };
    }),
});

const pluginsRouter = router({
  list: publicProcedure.query(async () => getAllPlugins()),
  getInstalled: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    const merchant = await getMerchantByUserId(ctx.user.id);
    if (!merchant) return [];
    return getMerchantPlugins(merchant.id);
  }),
  install: protectedProcedure
    .input(z.object({ pluginId: z.number(), config: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const merchant = await getMerchantByUserId(ctx.user.id);
      if (!merchant) throw new Error("Merchant not found");
      await installPlugin(merchant.id, input.pluginId, input.config);
      return { success: true };
    }),
});

const automationRouter = router({
  getHomeContent: publicProcedure.query(() => homeContent),
  getAppContent: publicProcedure.query(() => appContent),

  getMerchantConfig: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    return getMerchantAutomationConfig(ctx.user.id);
  }),

  updateMerchantConfig: protectedProcedure
    .input(
      z.object({
        autoValidationEnabled: z.boolean().optional(),
        whatsappValidationEnabled: z.boolean().optional(),
        autoShippingSelectionEnabled: z.boolean().optional(),
        trustThresholdForDeposit: z.number().min(10).max(90).optional(),
        defaultShippingCompany: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const config = updateMerchantAutomationConfig(ctx.user.id, input);
      return { success: true, config };
    }),

  simulateOrderDecision: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(6),
        amount: z.number().nonnegative().default(0),
        region: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const config = getMerchantAutomationConfig(ctx.user.id);

      // Use the advanced decision engine from ia-system
      const decision = await decisionEngine.decide({
        orderId: "sim-" + nanoid(8),
        phoneNumber: input.phoneNumber,
        orderAmount: input.amount,
        region: input.region,
        trustThresholdForDeposit: config.trustThresholdForDeposit,
        autoShippingSelectionEnabled: config.autoShippingSelectionEnabled,
        defaultShippingCompany: config.defaultShippingCompany,
      });

      const explanation = explainTrust({
        trustScore: decision.trustScore,
        rtoCount: 0,
        successfulOrders: 0,
      });

      return {
        ...decision,
        decisionReasons: [
          ...decision.reasons,
          `مستوى المخاطر: ${explanation.level}`,
          ...explanation.reasons,
          explanation.suggestedAction,
        ],
      };
    }),

  verifyWhatsAppCode: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        providedCode: z.string(),
        expectedCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return whatsappPipeline.verifyCode(
        { id: "pending" },
        input.providedCode,
        input.expectedCode
      );
    }),

  sendWhatsAppStatus: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        orderId: z.string(),
        status: z.enum([
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ]),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return whatsappPipeline.sendStatusUpdate(
        input.phoneNumber,
        input.orderId,
        input.status,
        input.details
      );
    }),

  getRoadmapIdeas: publicProcedure.query(() => {
    return [
      {
        key: "whatsapp_validation",
        title: "مساعد واتساب للتحقق",
        description:
          "تأكيدات أسرع عبر واتساب بصياغات ذكية باللغة المحلية لتقليل تجاهل المكالمات.",
        implemented: true,
        slug: "whatsapp-validation",
      },
      {
        key: "shipping_recommendation",
        title: "توصية أفضل شركة توصيل",
        description:
          "اختيار الناقل الأنسب حسب المنطقة ونسبة النجاح التاريخية لكل نوع طلب.",
        implemented: true,
        slug: "shipping-selector",
      },
      {
        key: "trust_explainability",
        title: "شرح سبب درجة الثقة",
        description:
          "عرض عوامل القرار للتاجر بشكل واضح حتى يتصرف بسرعة وبثقة.",
        implemented: true,
        slug: "trust-explainer",
      },
      {
        key: "growth_experiments",
        title: "تجارب نمو مدفوعة بالبيانات",
        description:
          "اقتراح خطوات عملية أسبوعية لتحسين نسبة التسليم وتقليل RTO تدريجياً.",
        implemented: true,
        slug: "growth-tips",
      },
    ];
  }),

  buildWhatsAppMessage: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1),
        orderAmount: z.number().nonnegative(),
      })
    )
    .query(async ({ input }) => {
      // Use advanced WhatsApp pipeline
      const result = await whatsappPipeline.execute(
        { id: "new", total: input.orderAmount },
        input.phoneNumber
      );
      return result.messageAr;
    }),

  explainTrustScore: publicProcedure
    .input(
      z.object({
        trustScore: z.number().min(0).max(100),
        rtoCount: z.number().min(0).optional(),
        successfulOrders: z.number().min(0).optional(),
      })
    )
    .query(({ input }) =>
      explainTrust({
        trustScore: input.trustScore,
        rtoCount: input.rtoCount,
        successfulOrders: input.successfulOrders,
      })
    ),

  recommendShipping: publicProcedure
    .input(
      z.object({
        trustScore: z.number().min(0).max(100),
        region: z.string().optional(),
        availableCarriers: z.array(
          z.object({ name: z.string(), coverage: z.string().optional() })
        ),
      })
    )
    .query(({ input }) =>
      selectShippingCarrier({
        trustScore: input.trustScore,
        region: input.region,
        availableCarriers: input.availableCarriers,
      })
    ),

  getGrowthTips: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Unauthorized");
    const merchant = await getMerchantByUserId(ctx.user.id);
    if (!merchant) return [];
    const totalOrders = merchant.totalOrders ?? 0;
    const successfulOrders = merchant.successfulOrders ?? 0;
    const rtoRate = merchant.rtoRate ?? 0;
    const successRate =
      totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0;
    return getGrowthTips({
      totalOrders,
      successfulOrders,
      rtoRate,
      successRate,
    });
  }),

  getWorkspacePlugins: publicProcedure.query(async () => loadPluginManifests()),
});

const pluginApiRouter = router({
  createOrder: pluginProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1),
        amount: z.number().nonnegative(),
        customerName: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { merchant } = ctx;
      const verification = await getPhoneVerification(input.phoneNumber);
      const trustScore = verification?.trustScore ?? 50;

      const order = await createOrder({
        merchantId: merchant.id,
        phoneNumber: input.phoneNumber,
        orderAmount: input.amount,
        trustScore,
        verificationStatus: trustScore < 50 ? "pending" : "verified",
        orderStatus: "placed",
        requiresVerification: trustScore < 50 ? 1 : 0,
        verificationMethod: trustScore < 50 ? "sms" : "none",
      });

      return { success: true, orderId: order.id, trustScore };
    }),

  checkPhone: pluginProcedure
    .input(z.object({ phoneNumber: z.string().min(1) }))
    .query(async ({ input }) => {
      const verification = await getPhoneVerification(input.phoneNumber);
      return {
        phoneNumber: input.phoneNumber,
        trustScore: verification?.trustScore ?? 50,
        riskLevel:
          (verification?.trustScore ?? 50) >= 70
            ? "low"
            : (verification?.trustScore ?? 50) >= 40
              ? "medium"
              : "high",
      };
    }),
});

const systemRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import("bcryptjs");
        const user = await getUserByEmail(input.email);
        if (!user?.passwordHash) throw new Error("Invalid email or password");
        const ok = await bcrypt.compare(input.password, user.passwordHash);
        if (!ok) throw new Error("Invalid email or password");
        const sessionId = nanoid(32);
        const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 365 * 1000);
        await createSession({ sessionId, userId: user.id, expiresAt });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        if (ctx.res?.setHeader) {
          ctx.res.setHeader(
            "Set-Cookie",
            `${COOKIE_NAME}=${sessionId}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; HttpOnly; SameSite=${cookieOptions.sameSite}`
          );
        }
        return { id: user.id, openId: user.openId, name: user.name, email: user.email, role: user.role } as const;
      }),
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6, "Password must be at least 6 characters"),
          name: z.string().min(1).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const bcrypt = await import("bcryptjs");
        const existing = await getUserByEmail(input.email);
        if (existing) throw new Error("An account with this email already exists");
        const openId = `email:${input.email.toLowerCase().trim()}`;
        const passwordHash = await bcrypt.hash(input.password, 10);
        await createUser({
          openId,
          email: input.email,
          name: input.name ?? null,
          passwordHash,
          loginMethod: "email",
        });
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const sessionId = getSessionIdFromCookie(ctx.req);
      if (sessionId) void deleteSessionBySessionId(sessionId);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      if (ctx.res?.setHeader) {
        ctx.res.setHeader(
          "Set-Cookie",
          `${COOKIE_NAME}=; Path=${cookieOptions.path}; Max-Age=-1; HttpOnly; SameSite=${cookieOptions.sameSite}`
        );
      }
      return { success: true } as const;
    }),
  }),
  merchants: merchantRouter,
  phoneVerification: phoneVerificationRouter,
  orders: ordersRouter,
  plugins: pluginsRouter,
  automation: automationRouter,
  pluginApi: pluginApiRouter,
});

export type AppRouter = typeof appRouter;
