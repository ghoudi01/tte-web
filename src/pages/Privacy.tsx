import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">سياسة الخصوصية</CardTitle>
              <p className="text-sm text-muted-foreground">آخر تحديث: فبراير 2025</p>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none space-y-6 text-slate-700">
              <p className="text-slate-600 leading-relaxed">
                تحترم محرك الثقة التونسي (Tunisia Trust Engine) خصوصيتك. توضح هذه السياسة أنواع البيانات التي نجمعها، وكيف نستخدمها، وحقوقك فيما يتعلق ببياناتك الشخصية وفقاً للتشريع التونسي والقانون العام لحماية البيانات الشخصية.
              </p>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">1. المسؤول عن المعالجة</h2>
                <p className="text-slate-600">
                  محرك الثقة التونسي هو المسؤول عن معالجة البيانات الشخصية التي يتم جمعها عبر الموقع والخدمة. للاتصال بنا: info@tunisiatrustengine.tn
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">2. البيانات التي نجمعها</h2>
                <ul className="list-disc pr-6 space-y-2 text-slate-600">
                  <li><strong>بيانات الحساب:</strong> البريد الإلكتروني، رقم الهاتف، اسم العمل أو الاسم الشخصي، العنوان، المدينة — عند التسجيل واستخدام الخدمة.</li>
                  <li><strong>بيانات الدفع:</strong> معلومات الدفع اللازمة لشراء الاعتمادات (يتم معالجتها عبر مزود دفع آمن ولا نخزن تفاصيل البطاقة كاملة).</li>
                  <li><strong>بيانات الاستخدام:</strong> سجل فحوصات أرقام الهواتف، استخدام API، سجل الاعتمادات (استهلاك وكسب)، إحصائيات التقارير والإحالات.</li>
                  <li><strong>بيانات التقارير:</strong> المعلومات التي تدخلها عند إضافة تقرير (اسم العميل، رقم الهاتف، تفاصيل الطلب، نوع التقرير) — لتحسين قاعدة الثقة وتقديم الخدمة.</li>
                  <li><strong>بيانات تقنية:</strong> عنوان IP، نوع المتصفح، نظام التشغيل، تواريخ الوصول — لأغراض الأمان والتحليل وتحسين الخدمة.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">3. أساس وأغراض المعالجة</h2>
                <p className="text-slate-600 mb-2">نعالج بياناتك على أساس تنفيذ العقد (تقديم الخدمة)، الالتزام القانوني، والمصلحة المشروعة (تحسين الخدمة والأمان). نستخدم البيانات من أجل:</p>
                <ul className="list-disc pr-6 space-y-1 text-slate-600">
                  <li>إنشاء حسابك وإدارة الاعتمادات والاشتراك.</li>
                  <li>تقديم خدمة التحقق من أرقام الهواتف وحساب درجات الثقة.</li>
                  <li>معالجة التقارير والإحالات ومنح الاعتمادات وفقاً لنظام الاعتمادات.</li>
                  <li>إرسال إشعارات مهمة (تأكيد التسجيل، تنبيهات رصيد الاعتمادات، تحديثات الخدمة).</li>
                  <li>تحسين الخدمة، تحليل الاستخدام، ومنع الاحتيال وإساءة الاستخدام.</li>
                  <li>الامتثال للالتزامات القانونية والرد على طلبات السلطات المختصة عند الاقتضاء.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">4. مشاركة البيانات مع الغير</h2>
                <p className="text-slate-600">
                  لا نبيع بياناتك الشخصية. قد نشارك بياناتك مع مزودي خدمات نثق بهم (استضافة، دفع، تحليلات، بريد إلكتروني) فقط بالقدر اللازم لتقديم الخدمة، وهم ملتزمون بحماية البيانات. قد نكشف عن بيانات عند وجود التزام قانوني أو أمر قضائي في تونس.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">5. الاحتفاظ بالبيانات</h2>
                <p className="text-slate-600">
                  نحتفظ ببياناتك طوال مدة وجود حسابك. بعد إغلاق الحساب، قد نحتفظ ببعض البيانات للفترة اللازمة للالتزامات القانونية أو فض النزاعات (مثلاً سنة واحدة). بيانات التقارير وأرقام الهواتف المُتحقق منها قد تُحفظ لفترة أطول لضمان سلامة قاعدة الثقة وعدم إساءة الاستخدام.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">6. الأمان</h2>
                <p className="text-slate-600">
                  نطبق تدابير فنية وتنظيمية مناسبة لحماية بياناتك: تشفير SSL/TLS للنقل، تخزين آمن، تقييد الوصول، ومراجعة دورية لإجراءات الأمان. في حال حدوث خرق للبيانات قد يؤثر عليك، سنعمل على إعلامك والسلطات المختصة وفقاً للقانون.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">7. ملفات تعريف الارتباط (Cookies)</h2>
                <p className="text-slate-600">
                  نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع (مثل الجلسة، الأمان، تذكر اللغة). قد نستخدم أيضاً ملفات تحليلية لفهم كيفية استخدام الخدمة. يمكنك ضبط متصفحك لرفض أو حذف بعض ملفات تعريف الارتباط، مع العلم أن ذلك قد يؤثر على بعض وظائف الموقع.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">8. حقوقك</h2>
                <p className="text-slate-600 mb-2">لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
                <ul className="list-disc pr-6 space-y-1 text-slate-600">
                  <li><strong>الوصول:</strong> الحصول على نسخة من بياناتك الشخصية.</li>
                  <li><strong>التصحيح:</strong> تصحيح البيانات غير الدقيقة أو استكمالها.</li>
                  <li><strong>الحذف:</strong> طلب حذف بياناتك في الحالات التي يسمح فيها القانون.</li>
                  <li><strong>تصدير البيانات:</strong> استلام بياناتك بشكل منظم (مثلاً CSV) حيثما يكون ذلك تقنياً ممكناً.</li>
                  <li><strong>الاعتراض أو تقييد المعالجة:</strong> في الحالات المنصوص عليها قانوناً.</li>
                </ul>
                <p className="text-slate-600 mt-2">
                  لممارسة هذه الحقوق، استخدم لوحة التحكم (الإعدادات، تصدير/حذف الحساب) أو راسلنا على: info@tunisiatrustengine.tn. لديك أيضاً الحق في تقديم شكوى إلى الهيئة الوطنية لحماية المعطيات الشخصية (INPDP) في تونس.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">9. القاصرون</h2>
                <p className="text-slate-600">
                  الخدمة موجهة للأشخاص الذين بلغوا سن الرشد أو الذين يملكون موافقة ولي الأمر. لا نجمع عن قصد بيانات شخصية من قاصرين دون سن 16 عاماً. إن علمنا بجمع بيانات قاصر بهذه الطريقة، سنعمل على حذفها.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">10. التعديلات على السياسة</h2>
                <p className="text-slate-600">
                  قد نحدّث سياسة الخصوصية من وقت لآخر. سننشر النسخة المحدثة على هذه الصفحة مع تاريخ "آخر تحديث". ننصحك بمراجعة هذه الصفحة دورياً. استمرارك في استخدام الخدمة بعد النشر يعد موافقة على التعديلات ما لم تتطلب التعديلات موافقة صريحة وفقاً للقانون.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2">11. الاتصال بنا</h2>
                <p className="text-slate-600">
                  لأي استفسار حول سياسة الخصوصية أو لممارسة حقوقك: <strong>info@tunisiatrustengine.tn</strong>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
