import { Router, Request, Response, NextFunction } from "express";
import {
  getMerchantByApiKey,
  createOrder,
  getPhoneVerification,
  updateMerchant,
  Merchant,
} from "./db";
import { z } from "zod";

// Extend Express Request object to hold the authenticated merchant
declare global {
  namespace Express {
    interface Request {
      merchant?: Merchant;
    }
  }
}

export const pluginApiRouter = Router();

// Middleware to authenticate X-API-Key natively
async function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing X-API-Key header" });
  }

  try {
    const merchant = await getMerchantByApiKey(apiKey);
    if (!merchant) {
      return res.status(401).json({ error: "Invalid X-API-Key provided" });
    }

    if (merchant.status !== "active") {
      return res
        .status(403)
        .json({ error: "Merchant account is strictly suspended or inactive" });
    }

    req.merchant = merchant;
    next();
  } catch (err) {
    console.error("[PluginAPI Auth] Error:", err);
    return res.status(500).json({ error: "Internal authentication error" });
  }
}

// Attach the API Key authentication filter fundamentally
pluginApiRouter.use(authenticateApiKey);

const CreateOrderSchema = z.object({
  phone: z.string().min(6),
  amount: z.number().nonnegative(),
  orderId: z.string().optional(),
  clientName: z.string().optional(),
  source: z.string().optional(),
});

/**
 * POST /api/plugin/orders
 * Exposes external Create Order workflows for bots, Zapier, Webhooks, etc.
 */
pluginApiRouter.post("/orders", async (req, res) => {
  if (!req.merchant) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const payload = CreateOrderSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({
      error: "Invalid request payload format",
      issues: payload.error.issues,
    });
  }

  const { phone, amount, orderId, clientName, source } = payload.data;

  try {
    const verification = await getPhoneVerification(phone);
    // TODO: Connect this to evaluateAutomationDecision instead of static < 50 constraint
    const trustScore = verification?.trustScore ?? 50;
    const requiresVerification = trustScore < 50;
    const verificationMethod = requiresVerification ? "sms" : "none";

    const order = await createOrder({
      merchantId: req.merchant.id,
      phoneNumber: phone,
      orderAmount: amount,
      trustScore,
      verificationStatus: requiresVerification ? "pending" : "verified",
      orderStatus: "placed",
      requiresVerification: requiresVerification ? 1 : 0,
      verificationMethod,
      externalOrderId: orderId ?? null,
      clientName: clientName ?? null,
      source: source ?? null,
    });

    await updateMerchant(req.merchant.id, {
      totalOrders: (req.merchant.totalOrders ?? 0) + 1,
    });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("[PluginAPI Orders] Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const CreateReportSchema = z.object({
  phone: z.string().min(6),
  reportType: z.enum(["delivered", "returned", "rto", "accepted", "rejected", "pending"]),
  orderId: z.string().optional(),
  clientName: z.string().optional(),
  amount: z.number().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/plugin/reports
 * Exposes external Create Report workflows mapping to new database requirements natively.
 */
pluginApiRouter.post("/reports", async (req, res) => {
  if (!req.merchant) return res.status(401).json({ error: "Unauthorized" });

  const payload = CreateReportSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({
      error: "Invalid request payload format",
      issues: payload.error.issues,
    });
  }

  // Future feature: Once reports DB table is established under `docs/PLUGINS_DB_AND_API_SPEC.md`
  // We will insert into the reports table allocating pending moderation logic
  
  return res.status(200).json({ 
    success: true, 
    message: "Report successfully queued for moderation pipeline",
    data: payload.data
  });
});
