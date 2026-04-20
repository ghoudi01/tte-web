import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, History } from "lucide-react";

const staticHistory = [
  { id: 1, phoneNumber: "+216 12 345 678", trustScore: 85, riskLevel: "low", date: "2024-12-20 10:30" },
  { id: 2, phoneNumber: "+216 23 456 789", trustScore: 72, riskLevel: "low", date: "2024-12-20 09:15" },
  { id: 3, phoneNumber: "+216 34 567 890", trustScore: 45, riskLevel: "medium", date: "2024-12-19 16:20" },
  { id: 4, phoneNumber: "+216 45 678 901", trustScore: 90, riskLevel: "low", date: "2024-12-19 14:10" },
  { id: 5, phoneNumber: "+216 56 789 012", trustScore: 35, riskLevel: "high", date: "2024-12-18 11:30" },
];

export default function PhoneVerificationHistory() {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">منخفضة</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">متوسطة</Badge>;
      case "high":
        return <Badge variant="destructive">عالية</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">سجل التحقق</h1>
          <p className="text-lg text-slate-600">آخر أرقام الهاتف التي تم التحقق منها</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              سجل التحقق من الهاتف
            </CardTitle>
            <CardDescription>{staticHistory.length} عملية تحقق</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-right py-3 px-4 font-semibold">رقم الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">درجة الثقة</th>
                    <th className="text-right py-3 px-4 font-semibold">مستوى المخاطرة</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {staticHistory.map((h) => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {h.phoneNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            h.trustScore >= 70
                              ? "bg-green-100 text-green-800"
                              : h.trustScore >= 40
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {h.trustScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4">{getRiskBadge(h.riskLevel)}</td>
                      <td className="py-3 px-4 text-slate-600">{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
