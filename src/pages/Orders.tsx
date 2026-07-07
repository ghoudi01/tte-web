import { useState, useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Package, Plus, Search, CheckCircle2, ChevronLeft, ChevronRight, FileText, ChevronDown, ChevronUp, Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";

const TUNISIAN_GOVERNORATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
  "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef",
  "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan",
];

type Order = {
  id: string;
  merchantId: string;
  customerName: string;
  phoneNumber: string;
  city?: string;
  orderAmount: number;
  status: string;
  verificationStatus: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  trustScore?: number;
  riskLevel?: string;
  decisionAction?: string;
};

type NewOrderForm = {
  customerName: string;
  phoneNumber: string;
  city: string;
  orderAmount: string;
};

const emptyForm: NewOrderForm = {
  customerName: "",
  phoneNumber: "",
  city: "",
  orderAmount: "",
};

const TERMINAL_STATUSES = ["delivered", "returned", "cancelled"] as const;

const OUTCOMES = [
  { value: "success", labelAr: "تم التوصيل بنجاح", labelFr: "Livré avec succès", labelEn: "Delivered successfully", icon: CheckCircle2 },
  { value: "fraud", labelAr: "احتيال", labelFr: "Fraude", labelEn: "Fraud" },
  { value: "complaint", labelAr: "شكوى", labelFr: "Réclamation", labelEn: "Complaint" },
] as const;

type ReportForm = {
  reportKind: string;
  trackingNumber: string;
  carrier: string;
  notes: string;
  showMore: boolean;
};

function defaultReportForm(): ReportForm {
  return { reportKind: "", trackingNumber: "", carrier: "", notes: "", showMore: false };
}

const ORDER_TABS = [
  { value: "all", labelKey: "orders.all" },
  { value: "pending", labelKey: "orders.pending" },
  { value: "placed", labelKey: "orders.placed" },
  { value: "confirmed", labelKey: "orders.confirmed" },
  { value: "shipped", labelKey: "orders.shipped" },
  { value: "delivered", labelKey: "orders.delivered" },
  { value: "returned", labelKey: "orders.returned" },
  { value: "cancelled", labelKey: "orders.cancelled" },
] as const;

function StatusBadge({ status }: { status?: string }) {
  const { t } = useLanguage();
  const cfg: Record<string, { label: string; class: string }> = {
    pending: { label: t("orders.pending"), class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200" },
    delivered: { label: t("orders.delivered"), class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200" },
    returned: { label: t("orders.returned"), class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200" },
    cancelled: { label: t("orders.cancelled"), class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200" },
    confirmed: { label: t("orders.confirmed"), class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200" },
  };
  const c = cfg[status ?? ""] ?? { label: status ?? "-", class: "bg-slate-100 dark:bg-slate-800" };
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", c.class)}>{c.label}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="flex flex-wrap gap-4"><Skeleton className="h-10 w-64" /></div>
      <Skeleton className="h-10 w-full max-w-lg rounded-lg" />
      <Card>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-t-xl" />
        <CardContent className="p-6">
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Orders() {
  const { t, dir, lang } = useLanguage();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewOrderForm>(emptyForm);
  const [reportOrder, setReportOrder] = useState<Order | null>(null);
  const [reportForm, setReportForm] = useState<ReportForm>(defaultReportForm);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const ordersQuery = trpc.orders.list.useQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search || undefined,
  }, {
    placeholderData: keepPreviousData,
  });

  const createMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
      toast.success(t("orders.createTitle"));
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: (data, variables) => {
      utils.orders.list.invalidate();
      if (TERMINAL_STATUSES.includes(variables.status as typeof TERMINAL_STATUSES[number])) {
        const order = (ordersQuery.data ?? []).find((o: Order) => o.id === variables.orderId);
        if (order) {
          setReportOrder(order);
          setPendingStatus(variables.status);
          setReportForm(defaultReportForm());
        }
      } else {
        toast.success(t("orders.statusUpdated"));
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const enrichMutation = trpc.orders.enrichReport.useMutation({
    onSuccess: () => {
      toast.success(t("orders.reportSaved"), {
        description: t("orders.creditEarned"),
        icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      });
      setReportOrder(null);
      setPendingStatus(null);
      utils.orders.list.invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const orders = (ordersQuery.data ?? []) as Order[];

  const filteredOrders = useMemo(() => orders, [orders]);

  if (ordersQuery.error?.message?.includes("Merchant not found")) {
    setLocation("/merchant-setup");
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pageOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.orderAmount);
    if (form.customerName.trim().length === 0) { toast.error(t("orders.customerName")); return; }
    if (form.phoneNumber.trim().length === 0) { toast.error(t("orders.phone")); return; }
    if (isNaN(amount) || amount < 0) { toast.error(t("orders.amount")); return; }
    createMutation.mutate({
      customerName: form.customerName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      city: form.city.trim() || undefined,
      orderAmount: amount,
    });
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleSkipReport = () => {
    setReportOrder(null);
    setPendingStatus(null);
    toast.success(t("orders.statusUpdated"));
  };

  const handleSubmitReport = () => {
    if (!reportOrder || !pendingStatus) return;
    if (!reportForm.reportKind) {
      toast.error(t("orders.selectOutcome"));
      return;
    }
    enrichMutation.mutate({
      orderId: reportOrder.id,
      reportKind: reportForm.reportKind,
      trackingNumber: reportForm.trackingNumber || undefined,
      carrier: reportForm.carrier || undefined,
      notes: reportForm.notes || undefined,
    });
  };

  const isDelivered = pendingStatus === "delivered";
  const outcomes = OUTCOMES;

  const outcomeLabel = (o: typeof outcomes[number]) => {
    if (lang === "ar") return (o as any).labelAr;
    if (lang === "fr") return (o as any).labelFr;
    return (o as any).labelEn;
  };

  if (ordersQuery.isPending && !ordersQuery.data) return <LoadingSkeleton />;

  if (ordersQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-xl" />
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("orders.error")}</p>
            <Button variant="outline" className="mt-4" onClick={() => ordersQuery.refetch()}>{t("dashboard.retry")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("orders.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("orders.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button onClick={() => { setForm(emptyForm); setDialogOpen(true); }} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />{t("orders.newOrder")}
            </Button>
            <DialogContent dir={dir} className="p-0 gap-0 sm:max-w-lg">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle>{t("orders.createTitle")}</DialogTitle>
                <DialogDescription>{t("orders.createDescription")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrder} className="flex flex-col max-h-[80vh]">
                <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oc-name">{t("orders.customerName")}</Label>
                    <Input id="oc-name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oc-phone">{t("orders.phone")}</Label>
                    <Input id="oc-phone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required dir="ltr" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oc-amount">{t("orders.amount")} ({t("orders.currencyTnd")})</Label>
                    <Input id="oc-amount" type="number" min="0" step="0.01" value={form.orderAmount} onChange={(e) => setForm({ ...form, orderAmount: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oc-city">{t("orders.city")}</Label>
                    <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                      <SelectTrigger id="oc-city">
                        <SelectValue placeholder={t("orders.cityPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {TUNISIAN_GOVERNORATES.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row justify-end border-t px-6 py-4 bg-background">
                  <DialogClose asChild><Button type="button" variant="outline">{t("common.cancel")}</Button></DialogClose>
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("common.save")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm w-full sm:w-auto">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t("orders.search")}
            className="ps-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" dir={dir}>
          {["all", "pending", "confirmed", "delivered", "returned", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter(status); setPage(0); }}
              className="text-xs h-9 px-3 rounded-lg"
            >
              {t(`orders.${status}`)}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-t-xl" />
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">{search ? t("orders.noMatching") : t("orders.noOrders")}</p>
              {!search && <Button variant="outline" size="sm" className="mt-3" onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 ms-1" />{t("orders.newOrder")}</Button>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.customer")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.phone")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.amount")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.trustScore")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.status")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.date")}</th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">{t("orders.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOrders.map((order) => {
                      const isTerminal = TERMINAL_STATUSES.includes(order.status as typeof TERMINAL_STATUSES[number]);
                      return (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{order.customerName}</td>
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground" dir="ltr">{order.phoneNumber}</td>
                          <td className="py-3 px-4 font-semibold text-foreground">{order.orderAmount.toFixed(2)} {t("orders.currencyTnd")}</td>
                          <td className="py-3 px-4">
                            {order.trustScore != null ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                order.riskLevel === "low" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                order.riskLevel === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              )}>
                                {order.trustScore}%
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{new Date(order.createdAt).toLocaleDateString(dir === "rtl" ? "ar-TN" : "fr-TN")}</span>
                              {isTerminal && (
                                <button
                                  type="button"
                                  onClick={() => { setReportOrder(order); setPendingStatus(order.status); setReportForm(defaultReportForm()); }}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title={t("orders.addReport")}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {order.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs gap-1"
                                    onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "confirmed" })}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    {t("common.confirm")}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs gap-1"
                                    onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "cancelled" })}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    {t("common.cancel")}
                                  </Button>
                                </>
                              )}
                              {order.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs"
                                  onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "delivered" })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  توصيل
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredOrders.length)} / {filteredOrders.length}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                    className="text-xs border border-border rounded px-1 py-0.5 bg-background text-foreground"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[4rem] text-center">{page + 1} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick report dialog */}
      <Dialog open={reportOrder !== null} onOpenChange={(open) => { if (!open) { setReportOrder(null); setPendingStatus(null); } }}>
        <DialogContent dir={dir} className="p-0 gap-0 sm:max-w-md">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              {isDelivered ? t("orders.reportDelivery") : t("orders.reportReturn")}
            </DialogTitle>
            <DialogDescription>
              {reportOrder && (
                <span className="text-sm text-muted-foreground">
                  {reportOrder.customerName} — {reportOrder.orderAmount.toFixed(2)} {t("orders.currencyTnd")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">{t("orders.outcome")}</Label>
              <div className="flex flex-wrap gap-2">
                {outcomes.map((o) => {
                  const isSelected = reportForm.reportKind === o.value;
                  const Icon = (o as any).icon;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, reportKind: o.value })}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors",
                        isSelected
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border hover:border-accent/50 hover:bg-muted/50"
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {outcomeLabel(o)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rpt-tracking" className="text-xs">{t("orders.trackingNumber")}</Label>
                  <Input
                    id="rpt-tracking"
                    value={reportForm.trackingNumber}
                    onChange={(e) => setReportForm({ ...reportForm, trackingNumber: e.target.value })}
                    placeholder={t("orders.trackingPlaceholder")}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rpt-carrier" className="text-xs">{t("orders.carrier")}</Label>
                  <Input
                    id="rpt-carrier"
                    value={reportForm.carrier}
                    onChange={(e) => setReportForm({ ...reportForm, carrier: e.target.value })}
                    placeholder={t("orders.carrierPlaceholder")}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReportForm({ ...reportForm, showMore: !reportForm.showMore })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {reportForm.showMore ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {reportForm.showMore ? t("orders.hideDetails") : t("orders.addDetails")}
              </button>

              {reportForm.showMore && (
                <div className="space-y-2">
                  <Label htmlFor="rpt-notes" className="text-xs">{t("orders.notes")}</Label>
                  <Textarea
                    id="rpt-notes"
                    value={reportForm.notes}
                    onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                    placeholder={t("orders.notesPlaceholder")}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t px-6 py-4 bg-background">
            <Button type="button" variant="ghost" size="sm" onClick={handleSkipReport}>
              {t("orders.skipReport")}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setReportOrder(null); setPendingStatus(null); }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={enrichMutation.isPending || !reportForm.reportKind}
                onClick={handleSubmitReport}
              >
                {enrichMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("orders.saveReport")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
