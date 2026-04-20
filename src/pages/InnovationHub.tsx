import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Link2, Shield, TrendingUp } from "lucide-react";

const modules = [
  {
    title: "الثقة والسياسات",
    desc: "Timeline + سياسات تلقائية + تنبيهات",
    path: "/innovation/trust",
    icon: Shield,
  },
  {
    title: "النمو والإيرادات",
    desc: "Benchmark + دفع حسب المخاطر + السمعة",
    path: "/innovation/growth",
    icon: TrendingUp,
  },
  {
    title: "التكاملات والأتمتة",
    desc: "DM parser + link in bio + plugin health + partner",
    path: "/innovation/integrations",
    icon: Link2,
  },
];

export default function InnovationHub() {
  const [, setLocation] = useLocation();
  return (
    <div className="p-4 md:p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black">MVP مقسم لصفحات واضحة</h1>
        <p className="text-slate-600">
          بدلاً من صفحة طويلة واحدة، تم تقسيم الأفكار إلى وحدات سهلة.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {modules.map(m => {
          const Icon = m.icon;
          return (
            <Card key={m.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {m.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">{m.desc}</p>
                <Button className="w-full" onClick={() => setLocation(m.path)}>
                  فتح الوحدة
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> الهدف
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          تجربة أسرع للمستخدم: قرارات أوضح، صفحات أبسط، وتدرج منطقي من المشكلة
          للحل.
        </CardContent>
      </Card>
    </div>
  );
}
