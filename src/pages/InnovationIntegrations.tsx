import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const pluginHealth = [
  { name: "Meta Webhook", success: "99.2%" },
  { name: "Zapier", success: "97.1%" },
  { name: "WhatsApp Bot", success: "95.6%" },
];

export default function InnovationIntegrations() {
  const [query, setQuery] = useState("order 21622123456 199");
  const parsed = useMemo(() => {
    const [type, phone, amount] = query.trim().split(/\s+/);
    return {
      type: type || "order",
      phone: phone || "",
      amount: Number(amount) || 0,
    };
  }, [query]);

  return (
    <div className="p-4 md:p-6 space-y-4" dir="rtl">
      <h1 className="text-2xl font-black">وحدة التكاملات والأتمتة</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>DM → Verified Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Input value={query} onChange={e => setQuery(e.target.value)} />
            <div className="rounded border p-2">
              {parsed.type} | {parsed.phone} | {parsed.amount}
            </div>
            <Button size="sm">إنشاء الطلب</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Smart Link in Bio</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <code>/report?phone=21622123456&amount=120</code>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Plugin Health + API Partner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {pluginHealth.map(p => (
            <div
              key={p.name}
              className="rounded border p-2 flex justify-between"
            >
              <span>{p.name}</span>
              <b>{p.success}</b>
            </div>
          ))}
          <Button variant="outline" size="sm">
            إنشاء Partner API Key
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
