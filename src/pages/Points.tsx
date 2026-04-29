import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Gift, ArrowLeftRight, History, Coins } from "lucide-react";
import { toast } from "sonner";

const staticBalance = 850;
const staticHistory = [
  { id: 1, type: "earn", amount: 50, reason: "تقرير مقبول", date: "2024-12-20" },
  { id: 2, type: "earn", amount: 75, reason: "إحالة جديدة", date: "2024-12-19" },
  { id: 3, type: "convert", amount: -200, reason: "تحويل إلى أموال", date: "2024-12-18" },
  { id: 4, type: "earn", amount: 50, reason: "تقرير مقبول", date: "2024-12-17" },
];

export default function Points() {
  const [location, setLocation] = useLocation();
  const [balance, setBalance] = useState(staticBalance);
  const [convertAmount, setConvertAmount] = useState("");
  const tabFromPath =
    location === "/points/convert" ? "convert" :
    location === "/points/history" ? "history" : "balance";

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(convertAmount, 10);
    if (!amount || amount <= 0) {
      toast.error("أدخل مبلغاً صحيحاً");
      return;
    }
    if (amount > balance) {
      toast.error("رصيدك غير كافٍ");
      return;
    }
    setBalance((b) => b - amount);
    setConvertAmount("");
    toast.success("تم تقديم طلب التحويل. سيتم المعالجة خلال 24 ساعة.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">النقاط والمكافآت</h1>
          <p className="text-lg text-slate-600">إدارة رصيدك وتحويل النقاط</p>
        </div>
        <Tabs value={tabFromPath} onValueChange={(v) => setLocation(v === "balance" ? "/points" : `/points/${v}`)} dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balance">رصيد النقاط</TabsTrigger>
            <TabsTrigger value="convert">تحويل النقاط</TabsTrigger>
            <TabsTrigger value="history">سجل النقاط</TabsTrigger>
          </TabsList>
          <TabsContent value="balance" className="space-y-4">
            <Card className="border-s-4 border-s-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  رصيدك الحالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">{balance.toLocaleString()}</div>
                <p className="text-sm text-slate-600 mt-1">نقطة متاحة للتحويل أو الاستخدام</p>
                <Button className="mt-4" onClick={() => setLocation("/points/convert")}>
                  تحويل إلى أموال
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="convert" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  تحويل النقاط إلى أموال
                </CardTitle>
                <CardDescription>نسبة التحويل: 100 نقطة = 1 د.ت</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConvert} className="space-y-4">
                  <div className="space-y-2">
                    <Label>عدد النقاط</Label>
                    <Input
                      type="number"
                      min="100"
                      step="100"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="مثال: 500"
                    />
                    <p className="text-xs text-slate-500">الحد الأدنى: 100 نقطة. الرصيد المتاح: {balance}</p>
                  </div>
                  <Button type="submit">تقديم طلب التحويل</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  سجل النقاط
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {staticHistory.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {h.type === "earn" ? (
                          <Coins className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        )}
                        <span>{h.reason}</span>
                      </div>
                      <span className={h.amount > 0 ? "text-green-600 font-medium" : "text-slate-600"}>
                        {h.amount > 0 ? "+" : ""}{h.amount}
                      </span>
                      <span className="text-sm text-slate-500">{h.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
