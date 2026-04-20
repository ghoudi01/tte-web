import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp } from "lucide-react";

export default function InnovationGrowth() {
  return (
    <div className="p-4 md:p-6 space-y-4" dir="rtl">
      <h1 className="text-2xl font-black">وحدة النمو والإيرادات</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>الدفع حسب المخاطر</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="rounded border p-2">ثقة 35 → عربون 20%</div>
            <div className="rounded border p-2">ثقة 58 → COD + واتساب</div>
            <div className="rounded border p-2">ثقة 78 → شحن مباشر</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            RTO لديك 14% مقابل متوسط السوق 11%.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> السمعة والاعتمادات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Badge>Silver Tier</Badge>
            <p>قبول البلاغات: 87%</p>
            <p>Auto-recharge: مفعل</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
