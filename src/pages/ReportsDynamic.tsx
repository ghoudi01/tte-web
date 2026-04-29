import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { FileText, Plus, CheckCircle2, Clock, XCircle, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { isValidTunisiaPhone } from "@/lib/phone";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const reportTypeOptions = [
  { value: "rto", label: "مرتجع (RTO)" },
  { value: "fraud", label: "احتيال" },
  { value: "complaint", label: "شكوى" },
  { value: "delivery_issue", label: "مشكلة تسليم" },
  { value: "other", label: "أخرى" },
  { value: "pending", label: "قيد المراجعة" },
  { value: "urgent", label: "عاجل" },
  { value: "success", label: "مكتمل / نجح" },
  { value: "accepted", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
];

export default function Reports() {
  const [location, setLocation] = useLocation();
  const { data: appContent, isLoading } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.reports;

  const { data: reports = [], isLoading: isReportsLoading } = trpc.reports.list.useQuery(
    { limit: 100 },
    { enabled: !!appContent }
  );

  const createReportMutation = trpc.reports.create.useMutation();

  const isNewReport = location === "/reports/new";
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    clientName: "",
    phoneNumber: "",
    externalOrderId: "",
    amount: "",
    reportType: "",
    trackingNumber: "",
    carrier: "",
    weight: "",
    clientAddress: "",
    city: "",
    orderDate: "",
    productDescription: "",
    notes: "",
  });

  const isValidPhone = formData.phoneNumber === "" || isValidTunisiaPhone(formData.phoneNumber);

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTunisiaPhone(formData.phoneNumber)) {
      toast.error("رقم الهاتف غير صحيح. الرجاء إدخال رقم تونسي صالح.");
      return;
    }
    if (!formData.reportType) {
      toast.error("يرجى اختيار نوع التقرير / الحالة");
      return;
    }
    try {
      await createReportMutation.mutateAsync({
        clientName: formData.clientName || undefined,
        phoneNumber: formData.phoneNumber,
        externalOrderId: formData.externalOrderId || undefined,
        amount: formData.amount ? Number(formData.amount) : undefined,
        reportType: formData.reportType as any,
        trackingNumber: formData.trackingNumber || undefined,
        carrier: formData.carrier || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        clientAddress: formData.clientAddress || undefined,
        city: formData.city || undefined,
        orderDate: formData.orderDate ? new Date(formData.orderDate).toISOString() : undefined,
        productDescription: formData.productDescription || undefined,
        notes: formData.notes || undefined,
      });
      toast.success("تم إرسال التقرير بنجاح");
      setLocation("/reports");
    } catch (error) {
      toast.error("فشل إرسال التقرير");
      console.error(error);
    }
  };

  const getReportTypeLabel = (value: string | undefined) => {
    if (!value) return "-";
    const o = reportTypeOptions.find((r) => r.value === value);
    return o?.label ?? value;
  };

  const getStatusBadge = (value: string | undefined) => {
    const status = value || "pending";
    switch (status) {
      case "verified":
      case "accepted":
      case "success":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> مقبول</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> قيد المراجعة</Badge>;
      case "rejected":
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading || isReportsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {!isNewReport ? (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "التقارير"}</h1>
              <p className="text-slate-600">{c?.pageSubtitle ?? "قائمة التقارير والحالات"}</p>
            </div>
            <Button onClick={() => setLocation("/reports/new")}>
              <Plus className="w-4 h-4 ml-2" />
              {c?.newReportButton ?? "تقرير جديد"}
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <Button variant="outline" onClick={() => setLocation("/reports")}>
              ← {c?.backButton ?? "رجوع للقائمة"}
            </Button>
          </div>
        )}

        {!isNewReport ? (
          <div className="grid gap-4">
            {reports.map((report: any) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport(report)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-semibold">{report.clientName || report.phoneNumber}</p>
                        <p className="text-sm text-slate-500">{report.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(report.status)}
                      <p className="text-sm text-slate-500 mt-1">{report.createdAt ? new Date(report.createdAt).toLocaleDateString('ar-TN') : "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{c?.newReportTitle ?? "إنشاء تقرير جديد"}</CardTitle>
              <CardDescription>{c?.newReportDescription ?? "أدخل معلومات التقرير"}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitNew} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">{c?.labels?.clientName ?? "اسم العميل"}</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{c?.labels?.phone ?? "رقم الهاتف"}</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="externalOrderId">{c?.labels?.orderId ?? "رقم الطلب"}</Label>
                    <Input
                      id="externalOrderId"
                      value={formData.externalOrderId}
                      onChange={(e) => setFormData({ ...formData, externalOrderId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">{c?.labels?.amount ?? "المبلغ"}</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">{c?.labels?.reportKind ?? "نوع التقرير"}</Label>
                  <Select value={formData.reportType} onValueChange={(v) => setFormData({ ...formData, reportType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={c?.labels?.selectReportType ?? "اختر نوع التقرير"} />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{c?.labels?.notes ?? "ملاحظات"}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createReportMutation.isPending}>
                  {createReportMutation.isPending ? "جاري الإرسال..." : (c?.submitButton ?? "إرسال التقرير")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {selectedReport && (
          <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent dir="rtl" className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{c?.detailsTitle ?? "تفاصيل التقرير"}</DialogTitle>
                <DialogDescription>{c?.detailsDescription ?? "معلومات كاملة عن التقرير"}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{c?.labels?.clientName ?? "اسم العميل"}</Label>
                    <p>{selectedReport.clientName || selectedReport.phoneNumber || "-"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">{c?.labels?.phone ?? "رقم الهاتف"}</Label>
                    <p>{selectedReport.phoneNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{c?.labels?.orderId ?? "رقم الطلب"}</Label>
                    <p>{selectedReport.externalOrderId || "-"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">{c?.labels?.amount ?? "المبلغ"}</Label>
                    <p>{selectedReport.amount ? `${selectedReport.amount} د.ت` : "-"}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">{c?.labels?.status ?? "الحالة"}</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString('ar-TN') : "-"}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}