import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Gift, ArrowLeftRight, History, Coins, Star, ShoppingCart, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Points() {
  const [location, setLocation] = useLocation();
  const [convertAmount, setConvertAmount] = useState("");
  const utils = trpc.useUtils();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.points;
  
  // Fetch user's points data
  const { data: merchantData } = trpc.merchants.getProfile.useQuery();
  const { data: ordersData } = trpc.orders.list.useQuery({ limit: 100 });
  
  // Calculate total points from orders
  const totalPoints = ordersData?.reduce((sum, order) => sum + (order.pointsEarned ?? 0), 0) ?? 0;
  const [balance, setBalance] = useState(totalPoints);
  
  // Update balance when orders data changes
  useEffect(() => {
    setBalance(totalPoints);
  }, [totalPoints]);

  // Build points history from orders
  const pointsHistory = ordersData
    ?.filter(order => order.pointsEarned && order.pointsEarned > 0)
    .map(order => ({
      id: order.id,
      type: "earn" as const,
      amount: order.pointsEarned!,
      reason: order.customerFeedback 
        ? `تقييم طلب #${order.id}` 
        : order.orderStatus === "delivered" 
          ? `تسليم طلب #${order.id}`
          : `نقاط طلب #${order.id}`,
      date: new Date(order.createdAt).toLocaleDateString("ar-TN"),
      orderId: order.id,
      feedbackRating: order.feedbackRating,
      sourcePlugin: order.sourcePlugin,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? [];

  const tabFromPath =
    location === "/points/convert" ? "convert" :
    location === "/points/history" ? "history" : "balance";

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(convertAmount, 10);
    if (!amount || amount <= 0) {
      toast.error(c?.errorInvalidAmount ?? "أدخل مبلغاً صحيحاً");
      return;
    }
    if (amount > balance) {
      toast.error(c?.errorInsufficientBalance ?? "رصيدك غير كافٍ");
      return;
    }
    if (amount < 100) {
      toast.error(c?.errorMinAmount ?? "الحد الأدنى للتحويل هو 100 نقطة");
      return;
    }
    setBalance((b) => b - amount);
    setConvertAmount("");
    toast.success(c?.successConvert ?? "تم تقديم طلب التحويل. سيتم المعالجة خلال 24 ساعة.");
  };

  const getPointsBreakdown = (points: number) => {
    if (points >= 15) return { base: 5, rating: 5, perfect: 5, delivery: 0 };
    if (points >= 10) return { base: 5, rating: 5, perfect: 0, delivery: 0 };
    if (points >= 5) return { base: 5, rating: 0, perfect: 0, delivery: 0 };
    return { base: 0, rating: 0, perfect: 0, delivery: points };
  };

  const getSourceIcon = (source?: string | null) => {
    switch (source) {
      case 'woocommerce': return <ShoppingCart className="w-3 h-3" />;
      case 'shopify': return <ShoppingCart className="w-3 h-3" />;
      case 'facebook': return <MessageSquare className="w-3 h-3" />;
      case 'chrome-extension': return <Gift className="w-3 h-3" />;
      default: return <Coins className="w-3 h-3" />;
    }
  };

  if (!merchantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center" dir="rtl">
        <p className="text-slate-600">{c?.loadingText ?? "جاري التحميل..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "النقاط والمكافآت"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "إدارة رصيدك وتحويل النقاط - اكسب نقاط على كل تقييم!"}</p>
        </div>
        
        {/* Points Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-s-4 border-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{c?.totalPoints ?? "إجمالي النقاط"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{balance.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{c?.pointsAvailable ?? "نقطة متاحة"}</p>
            </CardContent>
          </Card>
          
          <Card className="border-s-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{c?.fromFeedback ?? "من التقييمات"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {pointsHistory.filter(h => h.feedbackRating).reduce((sum, h) => sum + h.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">{c?.bonusPoints ?? "نقاط المكافآت"}</p>
            </CardContent>
          </Card>
          
          <Card className="border-s-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{c?.conversionRate ?? "سعر التحويل"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">100:1</div>
              <p className="text-xs text-slate-500 mt-1">{c?.perDinar ?? "نقطة = 1 د.ت"}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={tabFromPath} onValueChange={(v) => setLocation(v === "balance" ? "/points" : `/points/${v}`)} dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balance">{c?.tabBalance ?? "رصيد النقاط"}</TabsTrigger>
            <TabsTrigger value="convert">{c?.tabConvert ?? "تحويل النقاط"}</TabsTrigger>
            <TabsTrigger value="history">{c?.tabHistory ?? "سجل النقاط"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balance" className="space-y-4">
            <Card className="border-s-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  {c?.currentBalance ?? "رصيدك الحالي"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">{balance.toLocaleString()}</div>
                <p className="text-sm text-slate-600 mt-1">{c?.availableForUse ?? "نقطة متاحة للتحويل أو الاستخدام"}</p>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-700 mb-3">{c?.howToEarn ?? "كيف تكسب النقاط؟"}</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{c?.earnFeedback ?? "تقييم الطلب: 5 نقاط أساسية + 5 نقاط لتقييم 4-5 نجوم + 5 نقاط إضافية لتقييم 5 نجوم"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-500" />
                      <span>{c?.earnDelivery ?? "تأكيد التسليم: 2 نقطة"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-500" />
                      <span>{c?.earnMax ?? "الحد الأقصى للنقاط من تقييم واحد: 15 نقطة"}</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="mt-4" onClick={() => setLocation("/points/convert")}>
                  {c?.btnConvert ?? "تحويل إلى أموال"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="convert" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  {c?.convertTitle ?? "تحويل النقاط إلى أموال"}
                </CardTitle>
                <CardDescription>{c?.convertDesc ?? "نسبة التحويل: 100 نقطة = 1 د.ت"}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConvert} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{c?.labelPoints ?? "عدد النقاط"}</Label>
                    <Input
                      type="number"
                      min="100"
                      step="100"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder={c?.placeholderPoints ?? "مثال: 500"}
                    />
                    <p className="text-xs text-slate-500">{c?.minPoints ?? "الحد الأدنى: 100 نقطة."} {c?.availableBalance ?? "الرصيد المتاح:"} {balance}</p>
                    {convertAmount && (
                      <p className="text-sm font-medium text-green-600">
                        {c?.willReceive ?? "ستحصل على:"} {(parseInt(convertAmount) / 100).toFixed(2)} {c?.dinars ?? "د.ت"}
                      </p>
                    )}
                  </div>
                  <Button type="submit">{c?.btnSubmitConvert ?? "تقديم طلب التحويل"}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  {c?.historyTitle ?? "سجل النقاط"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pointsHistory.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">{c?.noHistory ?? "لا يوجد سجل نقاط بعد"}</p>
                ) : (
                  <ul className="space-y-3">
                    {pointsHistory.map((h) => {
                      const breakdown = getPointsBreakdown(h.amount);
                      return (
                        <li
                          key={h.id}
                          className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-slate-500">
                              {getSourceIcon(h.sourcePlugin)}
                            </div>
                            {h.feedbackRating ? (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < (h.feedbackRating!) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <Gift className="w-4 h-4 text-green-600" />
                            )}
                            <span className="text-sm">{h.reason}</span>
                          </div>
                          <div className="text-left">
                            <span className="text-green-600 font-bold">+{h.amount}</span>
                            {h.feedbackRating && (
                              <div className="text-xs text-slate-500">
                                {breakdown.base > 0 && <span>أساسي: {breakdown.base}</span>}
                                {breakdown.rating > 0 && <span> + تقييم: {breakdown.rating}</span>}
                                {breakdown.perfect > 0 && <span> + ممتاز: {breakdown.perfect}</span>}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500">{h.date}</span>
                            {h.sourcePlugin && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {h.sourcePlugin}
                              </Badge>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
