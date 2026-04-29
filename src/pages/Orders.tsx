import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Orders() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const utils = trpc.useUtils();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.orders;

  const statusFromUrl = useMemo(() => {
    const q = search && (search.startsWith("?") ? search.slice(1) : search);
    if (!q) return "all";
    const params = new URLSearchParams(q);
    const s = params.get("status");
    return s && ["placed", "shipped", "delivered", "returned", "cancelled"].includes(s) ? s : "all";
  }, [search]);

  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl);
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const limit = 20;

  const ordersQuery = trpc.orders.list.useQuery({
    limit,
    offset: page * limit,
    status: statusFilter !== "all" ? (statusFilter as "placed" | "shipped" | "delivered" | "returned" | "cancelled") : undefined,
    verificationStatus: verificationFilter !== "all" ? (verificationFilter as "pending" | "verified" | "failed" | "rejected") : undefined,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
      toast.success("تم تحديث حالة الطلب");
    },
    onError: (err) => {
      toast.error(err.message || "فشل تحديث الحالة");
    },
  });

  useEffect(() => {
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);

  useEffect(() => {
    if (ordersQuery.error?.message?.includes("Merchant not found")) {
      setLocation("/merchant-setup");
    }
  }, [ordersQuery.error?.message, setLocation]);

  const orders = ordersQuery.data ?? [];
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      orderStatus: newStatus as "placed" | "shipped" | "delivered" | "returned" | "cancelled",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "returned":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      placed: { label: c?.statusPlaced ?? "تم الطلب", variant: "outline" },
      shipped: { label: c?.statusShipped ?? "تم الشحن", variant: "default" },
      delivered: { label: c?.statusDelivered ?? "تم التسليم", variant: "default" },
      returned: { label: c?.statusReturned ?? "مرتجع", variant: "destructive" },
      cancelled: { label: c?.statusCancelled ?? "ملغي", variant: "secondary" },
    };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };


  if (ordersQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center" dir="rtl">
        <p className="text-slate-600">{c?.loadingText ?? "جاري التحميل..."}</p>
      </div>
    );
  }

  if (ordersQuery.error?.message?.includes("Merchant not found")) {
    return null;
  }

  if (ordersQuery.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center" dir="rtl">
        <p className="text-red-600">{c?.errorText ?? "حدث خطأ في تحميل الطلبات"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "إدارة الطلبات"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "عرض وإدارة جميع طلباتك"}</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">{c?.filterOrderStatus ?? "حالة الطلب"}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{c?.statusAll ?? "الكل"}</SelectItem>
                    <SelectItem value="placed">{c?.statusPlaced ?? "تم الطلب"}</SelectItem>
                    <SelectItem value="shipped">{c?.statusShipped ?? "تم الشحن"}</SelectItem>
                    <SelectItem value="delivered">{c?.statusDelivered ?? "تم التسليم"}</SelectItem>
                    <SelectItem value="returned">{c?.statusReturned ?? "مرتجع"}</SelectItem>
                    <SelectItem value="cancelled">{c?.statusCancelled ?? "ملغي"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">{c?.filterVerification ?? "حالة التحقق"}</label>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{c?.verificationAll ?? "الكل"}</SelectItem>
                    <SelectItem value="pending">{c?.verificationPending ?? "قيد الانتظار"}</SelectItem>
                    <SelectItem value="verified">{c?.verificationVerified ?? "تم التحقق"}</SelectItem>
                    <SelectItem value="failed">{c?.verificationFailed ?? "فشل"}</SelectItem>
                    <SelectItem value="rejected">{c?.verificationRejected ?? "مرفوض"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setVerificationFilter("all");
                  }}
                  className="w-full"
                >
                  {c?.resetFilters ?? "إعادة تعيين"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>{c?.tableTitle ?? "قائمة الطلبات"}</CardTitle>
            <CardDescription>
              {(c?.tableCount ?? "عرض {count} طلب").replace("{count}", String(orders.length))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">{c?.noOrders ?? "لا توجد طلبات"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" dir="rtl">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="text-right py-3 px-4">{c?.colPhone ?? "رقم الهاتف"}</th>
                      <th className="text-right py-3 px-4">{c?.colAmount ?? "المبلغ"}</th>
                      <th className="text-right py-3 px-4">{c?.colTrust ?? "درجة الثقة"}</th>
                      <th className="text-right py-3 px-4">{c?.colVerification ?? "التحقق"}</th>
                      <th className="text-right py-3 px-4">{c?.colStatus ?? "الحالة"}</th>
                      <th className="text-right py-3 px-4">{c?.colDate ?? "التاريخ"}</th>
                      <th className="text-right py-3 px-4">{c?.colActions ?? "الإجراءات"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono">{order.phoneNumber}</td>
                        <td className="py-3 px-4">{order.orderAmount} د.ت</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.trustScore || 50}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {order.verificationStatus === "verified" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(order.orderStatus)}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString('ar-TN')}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={order.orderStatus}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="placed">تم الطلب</SelectItem>
                              <SelectItem value="shipped">تم الشحن</SelectItem>
                              <SelectItem value="delivered">تم التسليم</SelectItem>
                              <SelectItem value="returned">مرتجع</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  السابق
                </Button>
                <span className="text-sm text-slate-600">الصفحة {page + 1}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={orders.length < limit}
                >
                  التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
