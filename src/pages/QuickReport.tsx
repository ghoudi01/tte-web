import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Package,
  User,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Plus,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const TUNISIAN_GOVERNORATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
  "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef",
  "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan",
];

const reportKindOptions = [
  { value: "success", labelKey: "reports.kindSuccess", icon: CheckCircle2 },
  { value: "fraud", labelKey: "reports.kindFraud", icon: AlertTriangle },
  { value: "complaint", labelKey: "reports.kindComplaint", icon: MessageSquare },
] as const;

const productCategories = [
  "electronics", "clothing", "shoes", "accessories",
  "home", "beauty", "food", "sports", "books", "other",
];

const steps = [
  { key: "product", labelKey: "quickReport.stepProduct", icon: Package },
  { key: "customer", labelKey: "quickReport.stepCustomer", icon: User },
  { key: "outcome", labelKey: "quickReport.stepOutcome", icon: CheckCircle2 },
];

interface QuickForm {
  productId: string | null;
  productName: string;
  productDescription: string;
  price: string;
  category: string;
  imageUrl: string;
  customerName: string;
  phoneNumber: string;
  city: string;
  reportKind: string;
  notes: string;
}

const initialForm: QuickForm = {
  productId: null,
  productName: "",
  productDescription: "",
  price: "",
  category: "",
  imageUrl: "",
  customerName: "",
  phoneNumber: "",
  city: "",
  reportKind: "",
  notes: "",
};

export default function QuickReport() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<QuickForm>(initialForm);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerList, setShowCustomerList] = useState(false);

  const productsQuery = trpc.products.list.useQuery();
  const products = (productsQuery.data ?? []) as any[];

  const customersQuery = trpc.orders.searchCustomers.useQuery(
    { query: customerSearch || "__empty__" },
    { enabled: customerSearch.length >= 2 },
  );
  const customers = (customersQuery.data ?? []) as any[];

  const recentCustomersQuery = trpc.orders.recentCustomers.useQuery(
    { limit: 10 },
    { enabled: step === 1 && customerSearch.length === 0 },
  );
  const recentCustomers = (recentCustomersQuery.data ?? []) as any[];

  const quickMutation = trpc.merchantReports.quickReport.useMutation({
    onSuccess: () => {
      toast.success(t("quickReport.success"), {
        icon: <Sparkles className="w-4 h-4" />,
      });
      setForm(initialForm);
      setShowNewProduct(false);
      setCustomerSearch("");
      setStep(0);
      setLocation("/reports");
    },
    onError: (err: any) => toast.error(err.message ?? t("common.error")),
  });

  const set = (partial: Partial<QuickForm>) => setForm((f) => ({ ...f, ...partial }));

  const selectProduct = (p: any) => {
    set({
      productId: p.id,
      productName: p.name,
      productDescription: p.description || "",
      price: String(p.price),
      category: p.category || "",
      imageUrl: p.imageUrl || "",
    });
    setShowNewProduct(false);
  };

  const clearProduct = () => {
    set({
      productId: null,
      productName: "",
      productDescription: "",
      price: "",
      category: "",
      imageUrl: "",
    });
    setShowNewProduct(false);
  };

  const handleCustomerSelect = (c: any) => {
    set({ customerName: c.customerName, phoneNumber: c.phoneNumber, city: c.city || form.city });
    setCustomerSearch(c.customerName);
    setShowCustomerList(false);
  };

  const canGoNext = () => {
    if (step === 0) return form.productName.trim().length > 0 && Number(form.price) > 0;
    if (step === 1) return form.customerName.trim().length > 0 && form.phoneNumber.trim().length > 0;
    return false;
  };

  const canSubmit = () => form.reportKind.length > 0;

  const handleSubmit = () => {
    if (!canSubmit()) { toast.error(t("reports.selectKind")); return; }
    quickMutation.mutate({
      productName: form.productName.trim() || undefined,
      productDescription: form.productDescription.trim() || undefined,
      productCategory: form.category.trim() || undefined,
      price: Number(form.price),
      customerName: form.customerName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      city: form.city.trim() || undefined,
      orderAmount: Number(form.price),
      reportKind: form.reportKind,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <div className="bg-background absolute inset-0 flex flex-col" dir={dir}>
      {/* Back + title (sticky top) */}
      <div className="shrink-0 px-4 pt-4 pb-2 bg-background border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/reports")} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("sidebar.quickReport")}</h1>
            <p className="text-sm text-muted-foreground">{t("quickReport.subtitle")}</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="mt-3">
          <div className="flex items-center">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors shrink-0",
                      isDone ? "bg-accent text-accent-foreground" :
                      isActive ? "bg-accent/10 text-accent border-2 border-accent" :
                      "bg-muted text-muted-foreground border border-border"
                    )}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn(
                      "text-xs font-medium hidden sm:inline",
                      isActive ? "text-accent" : isDone ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {t(s.labelKey)}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-2", i < step ? "bg-accent" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable step content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4">
        <Card className="border-t-4 border-t-accent">
          <CardContent className="p-4 md:p-5">

            {/* Step 0: Product */}
            {step === 0 && (
              <div className="space-y-4">

                {/* Saved products grid */}
                    {!showNewProduct && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">{t("quickReport.savedProducts")}</Label>
                        {productsQuery.isLoading ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
                          </div>
                        ) : products.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4">{t("products.noProducts")}</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                            {products.map((p: any) => {
                              const selected = form.productId === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => selectProduct(p)}
                                  className={cn(
                                    "flex flex-col items-start gap-1 p-3 rounded-lg border text-start transition-all",
                                    selected
                                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                                      : "border-border hover:border-accent/50 hover:bg-muted/50"
                                  )}
                                >
                                  <span className="text-sm font-medium text-foreground leading-tight line-clamp-2">{p.name}</span>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {p.category && <Badge variant="outline" className="text-[10px]">{p.category}</Badge>}
                                  </div>
                                  <span className="text-xs font-semibold text-accent">{Number(p.price).toFixed(2)} TND</span>
                                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {!productsQuery.isLoading && (
                          <button
                            type="button"
                            onClick={() => { clearProduct(); setShowNewProduct(true); }}
                            className="mt-2 flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            {t("quickReport.addNewProduct")}
                          </button>
                        )}
                      </div>
                    )}

                {/* New product / edit fields */}
                {(showNewProduct || (products.length === 0 && !productsQuery.isLoading)) && (
                  <div className="space-y-4">
                    {products.length > 0 && (
                      <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                        <button
                          type="button"
                          onClick={() => setShowNewProduct(false)}
                          className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          {t("quickReport.backToProducts")}
                        </button>
                      </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="qp-name">{t("products.name")}</Label>
                      <Input id="qp-name" value={form.productName} onChange={(e) => set({ productName: e.target.value })} required />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label htmlFor="qp-desc">{t("products.description")}</Label>
                      <Textarea id="qp-desc" value={form.productDescription} onChange={(e) => set({ productDescription: e.target.value })} rows={3} placeholder={t("products.description")} />
                    </div>

                    {/* Price / Category */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="qp-price">{t("products.price")} ({t("orders.currencyTnd")})</Label>
                        <Input id="qp-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set({ price: e.target.value })} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="qp-category">{t("products.category")}</Label>
                        <Input id="qp-category" value={form.category} onChange={(e) => set({ category: e.target.value })} list="categories-quick" />
                        <datalist id="categories-quick">
                          {productCategories.map((c) => <option key={c} value={c} />)}
                        </datalist>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1.5">
                      <Label htmlFor="qp-image">{t("products.imageUrl")}</Label>
                      <Input id="qp-image" type="url" value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://..." />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Customer */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-foreground">{t("quickReport.stepCustomer")}</span>
                </div>

                {/* Recent customers grid */}
                {customerSearch.length === 0 && (recentCustomersQuery.isLoading || recentCustomers.length > 0) && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t("quickReport.savedCustomers")}</Label>
                    {recentCustomersQuery.isLoading ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="flex flex-col gap-1.5 p-3 rounded-lg border border-border">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {recentCustomers.map((c: any, i: number) => (
                          <button
                            key={`${c.phoneNumber}-${i}`}
                            type="button"
                            onClick={() => handleCustomerSelect(c)}
                            className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border text-start hover:border-accent/50 hover:bg-muted/50 transition-all"
                          >
                            <span className="text-sm font-medium text-foreground leading-tight">{c.customerName}</span>
                            <span className="font-mono text-xs text-muted-foreground" dir="ltr">{c.phoneNumber}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {c.city && <span>{c.city}</span>}
                              <span>{c.lastAmount} TND</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 mb-1 text-xs text-muted-foreground text-center">{t("quickReport.orEnterNew")}</div>
                  </div>
                )}

                <div className="relative space-y-1.5">
                  <Label className="text-sm font-medium">
                    {t("quickReport.customerName")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) => {
                      set({ customerName: e.target.value });
                      setCustomerSearch(e.target.value);
                      if (e.target.value.length >= 2) setShowCustomerList(true);
                      else setShowCustomerList(false);
                    }}
                    onFocus={() => { if (form.customerName.length >= 2) setShowCustomerList(true); }}
                    placeholder={t("quickReport.customerNamePlaceholder")}
                  />
                  {showCustomerList && customers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-40 overflow-y-auto">
                      {customers.map((c: any, i: number) => (
                        <button key={`${c.phoneNumber}-${i}`} type="button" onClick={() => handleCustomerSelect(c)}
                          className="w-full px-3 py-2 text-start text-sm hover:bg-accent/10 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{c.customerName}</span>
                            <span className="text-xs text-muted-foreground">{c.lastAmount} TND</span>
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono" dir="ltr">{c.phoneNumber}</span>
                            {c.city && <span>· {c.city}</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    {t("quickReport.phone")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={form.phoneNumber}
                    onChange={(e) => set({ phoneNumber: e.target.value })}
                    placeholder={t("quickReport.phonePlaceholder")}
                    className="font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">{t("quickReport.city")}</Label>
                  <Select value={form.city} onValueChange={(v) => set({ city: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("quickReport.cityPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {TUNISIAN_GOVERNORATES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Outcome */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Outcome cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {reportKindOptions.map((o) => {
                    const isSelected = form.reportKind === o.value;
                    const Icon = (o as any).icon;
                    const details = {
                      success: {
                        gradient: "from-emerald-500 to-emerald-600",
                        lightBg: "bg-emerald-50 dark:bg-emerald-950/30",
                        border: "border-emerald-200 dark:border-emerald-800",
                        desc: t("quickReport.successDesc"),
                      },
                      fraud: {
                        gradient: "from-red-500 to-rose-600",
                        lightBg: "bg-red-50 dark:bg-red-950/30",
                        border: "border-red-200 dark:border-red-800",
                        desc: t("quickReport.fraudDesc"),
                      },
                      complaint: {
                        gradient: "from-amber-500 to-orange-600",
                        lightBg: "bg-amber-50 dark:bg-amber-950/30",
                        border: "border-amber-200 dark:border-amber-800",
                        desc: t("quickReport.complaintDesc"),
                      },
                    }[o.value]!;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => set({ reportKind: o.value })}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all",
                          isSelected
                            ? `${details.border} ${details.lightBg} ring-2 ring-offset-2 ring-[var(--ring-color)]`
                            : "border-border hover:border-foreground/20 hover:shadow-sm"
                        )}
                        style={isSelected ? { "--ring-color": o.value === "success" ? "#10b981" : o.value === "fraud" ? "#ef4444" : "#f59e0b" } as React.CSSProperties : undefined}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br text-white shadow",
                          details.gradient
                        )}>
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-foreground block">{t(o.labelKey)}</span>
                          <span className="text-[11px] text-muted-foreground block leading-snug mt-0.5">{details.desc}</span>
                        </div>
                        {isSelected && (
                          <div className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r",
                            details.gradient
                          )}>
                            {t("quickReport.selected")}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">{t("quickReport.notes")}</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => set({ notes: e.target.value })}
                    placeholder={t("quickReport.notesPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-muted/50 border p-5 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-semibold text-foreground">{t("quickReport.summary")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("reports.product")}</span>
                    <span className="font-medium text-foreground">{form.productName || "—"}</span>
                  </div>
                  {form.category && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("products.category")}</span>
                      <span className="text-foreground">{form.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("quickReport.customerName")}</span>
                    <span className="font-medium text-foreground">{form.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("quickReport.phone")}</span>
                    <span className="font-mono text-xs text-foreground">{form.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("quickReport.amount")}</span>
                    <span className="font-bold text-foreground">{Number(form.price).toFixed(3)} TND</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fixed bottom navigation bar */}
      <div className="shrink-0 border-t bg-background shadow-[0_-2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.2)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                {t("common.back")}
              </Button>
            )}
          </div>

          <div>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canGoNext()} className="gap-1.5">
                {t("common.next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={quickMutation.isPending || !canSubmit()}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {quickMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {quickMutation.isPending ? t("quickReport.submitting") : t("quickReport.submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
