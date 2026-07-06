import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { AUTH_ME_QUERY_OPTS } from "@/constants/auth";
import { trpc } from "@/lib/trpc";
import { Shield, Clock, SearchX } from "lucide-react";

export default function AdminReports() {
  const { t, dir } = useLanguage();
  const { data: me, isLoading: meLoading } = trpc.auth.me.useQuery(undefined, { ...AUTH_ME_QUERY_OPTS });
  const listQuery = trpc.admin.listReports.useQuery(undefined, {
    enabled: me?.role === "admin",
    refetchInterval: me?.role === "admin" ? 15000 : false
  });

  if (meLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  if (me?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card><CardContent className="pt-6 text-center">
          <Shield className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">{t("common.unauthorized")}</p>
          <p className="text-sm text-muted-foreground mt-2">{t("common.unauthorizedDesc")}</p>
        </CardContent></Card>
      </div>
    );
  }

  const reports = listQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("admin.reports.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("admin.reports.subtitle")}</p>
      </div>

      {listQuery.isLoading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
      ) : reports.length === 0 ? (
        <Card className="shadow-sm border-0 dark:bg-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            <SearchX className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("admin.reports.noReports")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report: { id: string; clientName?: string; customerName?: string; phone: string; amount: number; createdAt: string }) => (
            <Card key={report.id} className="shadow-sm border-0 dark:bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{report.clientName || report.customerName}</p>
                    </div>
                    <p className="text-sm text-muted-foreground" dir="ltr">{report.phone}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{t("orders.amount")}: {new Intl.NumberFormat("ar-TN", { style: "currency", currency: "TND" }).format(report.amount || 0)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(report.createdAt).toLocaleDateString("ar-TN")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
