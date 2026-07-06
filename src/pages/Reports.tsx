import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, FileText, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const reportKindOptions = [
  { value: "success", labelKey: "reports.kindSuccess" },
  { value: "fraud", labelKey: "reports.kindFraud" },
  { value: "complaint", labelKey: "reports.kindComplaint" },
] as const;

interface Report {
  id: string;
  clientName: string;
  phone: string;
  orderId: string;
  amount: number;
  reportKind: string;
  reviewStatus: string;
  trackingNumber?: string;
  carrier?: string;
  weight?: string;
  clientAddress?: string;
  city?: string;
  orderDate?: string;
  productName?: string;
  notes?: string;
  createdAt: string;
}

function getKindLabel(value: string): string {
  const found = reportKindOptions.find((o) => o.value === value);
  return found ? found.labelKey : value;
}

export default function Reports() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [kindFilter, setKindFilter] = useState("all");

  const listQuery = trpc.merchantReports.list.useQuery();
  const reports: Report[] = listQuery.data ?? [];

  const filtered = useMemo(() => {
    let result = reports;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.clientName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.orderId.toLowerCase().includes(q)
      );
    }
    if (kindFilter !== "all") {
      result = result.filter((r) => r.reportKind === kindFilter);
    }
    return result;
  }, [reports, search, kindFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageReports = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("reports.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("reports.subtitle")}</p>
        </div>
        <Button onClick={() => setLocation("/reports/quick")} size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          {t("sidebar.quickReport")}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t("orders.search")}
            className="ps-10 h-9"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => { setKindFilter(v); setPage(0); }} dir={dir}>
          <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("orders.all")}</SelectItem>
            {reportKindOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{t(o.labelKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {listQuery.isLoading ? (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-foreground">{t("reports.noReports")}</p>
            <p className="text-sm text-muted-foreground">{t("reports.noReportsHint")}</p>
            <Button className="mt-6 gap-2" onClick={() => setLocation("/reports/quick")}>
              <Zap className="w-4 h-4" />
              {t("sidebar.quickReport")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">{t("orders.customer")}</TableHead>
                    <TableHead className="text-start">{t("orders.phone")}</TableHead>
                    <TableHead className="text-start">{t("orders.amount")}</TableHead>
                    <TableHead className="text-start">{t("reports.reportKind")}</TableHead>
                    <TableHead className="text-start">{t("orders.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium text-foreground">{report.clientName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">{report.phone}</TableCell>
                      <TableCell className="font-semibold">{report.amount.toLocaleString()} {t("orders.currencyTnd")}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          report.reportKind === "success"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : report.reportKind === "fraud"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        )}>
                          {t(getKindLabel(report.reportKind))}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString(dir === "rtl" ? "ar-TN" : "en-US")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground" dir="ltr">
                  {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} / {filtered.length}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
