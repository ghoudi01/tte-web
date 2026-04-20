import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, GitBranch, SlidersHorizontal } from "lucide-react";

const trustEvents = [
  { reason: "تم استلام تقرير جديد", delta: -12 },
  { reason: "تحقق هاتف ناجح", delta: +8 },
  { reason: "تكرار إرجاع في نفس المنطقة", delta: -6 },
];

export default function InnovationTrust() {
  const [threshold, setThreshold] = useState(40);
  return (
    <div className="p-4 md:p-6 space-y-4" dir="rtl">
      <h1 className="text-2xl font-black">وحدة الثقة والسياسات</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> Timeline تفسير درجة الثقة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trustEvents.map(e => (
              <div
                key={e.reason}
                className="rounded-lg border p-2 flex justify-between"
              >
                <span>{e.reason}</span>
                <b
                  className={e.delta > 0 ? "text-emerald-600" : "text-rose-600"}
                >
                  {e.delta > 0 ? `+${e.delta}` : e.delta}
                </b>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> محرك سياسات تلقائي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              أقل من <b>{threshold}</b> → طلب عربون تلقائي.
            </p>
            <Input
              type="range"
              min={20}
              max={80}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
            />
            <Button size="sm">حفظ</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> تنبيهات الاحتيال
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          تم اكتشاف نمط مشبوه: 3 طلبات بنفس الجهاز خلال 24 ساعة.
        </CardContent>
      </Card>
    </div>
  );
}
