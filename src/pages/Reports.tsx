import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { FileText, Plus, CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { isValidTunisiaPhone } from "@/lib/phone";
import { Skeleton } from "@/components/ui/skeleton";

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

const staticReports = [
  { id: 1, clientName: "أحمد محمد", phoneNumber: "+216 12 345 678", externalOrderId: "ORD-1001", amount: 150, reportType: "accepted", createdAt: "2024-12-20", trackingNumber: "TN123456" },
  { id: 2, clientName: "فاطمة علي", phoneNumber: "+216 23 456 789", externalOrderId: "ORD-1002", amount: 280, reportType: "pending", createdAt: "2024-12-19", trackingNumber: "TN123457" },
  { id: 3, clientName: "محمد حسن", phoneNumber: "+216 34 567 890", externalOrderId: "ORD-1003", amount: 95, reportType: "accepted", createdAt: "2024-12-18", trackingNumber: "-" },
  { id: 4, clientName: "سارة أحمد", phoneNumber: "+216 45 678 901", externalOrderId: "ORD-1004", amount: 320, reportType: "rejected", createdAt: "2024-12-17", trackingNumber: "TN123458" },
];

export default function Reports() {
  const [location, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.reports;
  const isNewReport = location === "/reports/new";
  const { data: response, isLoading: isReportsLoading } = trpc.reports.list.useQuery(
    { limit: 100 },
    { enabled: !isNewReport }
  );
  const reports = response?.items ?? [];
  const createReportMutation = trpc.reports.create.useMutation();

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

  const getReportTypeLabel = (value: string) => {
    const o = reportTypeOptions.find((r) => r.value === value);
    return o?.label ?? value;
  };

  const getReportTypeBadge = (value: string) => {
    switch (value) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> مقبول</Badge>;
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> مكتمل</Badge>;
      case "pending":
      case "urgent":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> {value === "urgent" ? "عاجل" : "قيد المراجعة"}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> مرفوض</Badge>;
      default:
        return <Badge variant="outline">{getReportTypeLabel(value)}</Badge>;
    }
  };

  if (isNewReport && isReportsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isNewReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.newReport ?? "تقرير جديد"}</h1>
            <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "إضافة وعرض تقارير الطلبات والعملاء"}</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>معلومات التقرير</CardTitle>
              <CardDescription>أدخل تفاصيل العميل والطلب. تقرير مقبول = +2 اعتماد.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitNew} className="space-y-6" dir="rtl">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b pb-2">معلومات العميل والطلب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">اسم العميل *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+216 XX XXX XXX"
                        className={!isValidPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        required
                      />
                      {!isValidPhone && (
                        <p className="text-xs text-red-500">الرجاء إدخال رقم تونسي صالح (8 أرقام).</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientAddress">عنوان العميل</Label>
                      <Input
                        id="clientAddress"
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        placeholder="العنوان الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="المدينة"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalOrderId">رقم الطلب *</Label>
                      <Input
                        id="externalOrderId"
                        value={formData.externalOrderId}
                        onChange={(e) => setFormData({ ...formData, externalOrderId: e.target.value })}
                        placeholder="ORD-XXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderDate">تاريخ الطلب</Label>
                      <Input
                        id="orderDate"
                        type="date"
                        value={formData.orderDate}
                        onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">المبلغ (د.ت) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productDescription">وصف المنتج/الطلب</Label>
                      <Input
                        id="productDescription"
                        value={formData.productDescription}
                        onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                        placeholder="وصف مختصر للمنتج أو الطلب"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    معلومات Colis / الشحن
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">رقم التتبع</Label>
                      <Input
                        id="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                        placeholder="رقم تتبع الشحنة"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carrier">شركة الشحن</Label>
                      <Input
                        id="carrier"
                        value={formData.carrier}
                        onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                        placeholder="مثال: DHL، La Poste"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">الوزن (كغ)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b pb-2">نوع التقرير / الحالة</h3>
                  <div className="space-y-2">
                    <Label>نوع التقرير / الحالة *</Label>
                    <Select
                      value={formData.reportType}
                      onValueChange={(v) => setFormData({ ...formData, reportType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع التقرير أو الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="تفاصيل إضافية أو وصف المشكلة..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createReportMutation.isPending}>
                    {createReportMutation.isPending ? "جاري الإرسال..." : "إرسال التقرير"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setLocation("/reports")}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "التقارير"}</h1>
            <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "إضافة وعرض تقارير الطلبات والعملاء"}</p>
          </div>
          <Button onClick={() => setLocation("/reports/new")}>
            <Plus className="w-4 h-4 mr-2" />
            {c?.newReport ?? "تقرير جديد"}
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{c?.listReports ?? "قائمة التقارير"}</CardTitle>
            <CardDescription>{reports.length} تقرير</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-right py-3 px-4 font-semibold">العميل</th>
                    <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">رقم الطلب</th>
                    <th className="text-right py-3 px-4 font-semibold">نوع / الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">رقم التتبع</th>
                    <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r: any) => {
                    const row = r as { reportType?: string; trackingNumber?: string };
                    const reportType = row.reportType ?? "";
                    return (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium">{r.clientName}</td>
                        <td className="py-3 px-4 font-mono">{r.phoneNumber}</td>
                        <td className="py-3 px-4">{r.externalOrderId || "-"}</td>
                        <td className="py-3 px-4">{getReportTypeBadge(reportType)}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{row.trackingNumber || "-"}</td>
                        <td className="py-3 px-4">{r.amount ?? "-"} د.ت</td>
                        <td className="py-3 px-4 text-slate-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-TN') : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
