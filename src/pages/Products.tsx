import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, Package, Plus, Pencil, Search, MessageCircle, Download, Link, X, Trash2, GripVertical, Bot, BarChart3, Settings2, Save, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  fbIgEnabled?: boolean;
  fbIgOptions?: any;
  fbIgQuestions?: any;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  fbIgEnabled: boolean;
  fbIgQuestions?: { label: string; type: "text" | "number" | "select"; options?: string; required?: boolean }[];
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  fbIgEnabled: false,
  fbIgQuestions: [],
};

const FAKE_CONVERSIONS = [
  {
    id: "conv-1",
    customerName: "أحمد بن علي",
    phoneNumber: "+216 98 123 456",
    createdAt: "2026-07-06T14:30:00Z",
    status: "confirmed",
    trustScore: 88,
    lastMessage: "قداش سوم الصباط وهل فما توصيل لسوسة؟",
    messages: [
      { role: "customer", text: "مرحبا، حبيت نسأل على الصباط هذا", time: "14:20" },
      { role: "bot", text: "👋 أهلاً بك! الصباط متوفر وبجودة عالية. كيف يمكنني مساعدتك؟", time: "14:20" },
      { role: "customer", text: "قداش السوم وهل فما توصيل لسوسة؟", time: "14:21" },
      { role: "bot", text: "💰 سعر المنتج هو 79 د.ت.\n🚚 نعم، متوفر التوصيل لكامل تراب الجمهورية بما في ذلك سوسة بـ 7 د.ت فقط!", time: "14:21" },
      { role: "customer", text: "باهي نحب نشري واحد قياس 42 لون أسود", time: "14:22" },
      { role: "bot", text: "🛍️ رائع! لإتمام الطلب، يرجى تزويدي برقم هاتفك والاسم الكامل.", time: "14:22" },
      { role: "customer", text: "98123456 أحمد بن علي", time: "14:23" },
      { role: "bot", text: "✅ تم تسجيل طلبك بنجاح! رقم الهاتف: +216 98 123 456. سيتم الاتصال بك لتأكيد الشحن.", time: "14:24" },
    ]
  },
  {
    id: "conv-2",
    customerName: "مريم العياري",
    phoneNumber: "+216 55 456 789",
    createdAt: "2026-07-05T09:15:00Z",
    status: "delivered",
    trustScore: 95,
    lastMessage: "تم الاستلام، شكرا جزيلا جودة ممتازة!",
    messages: [
      { role: "customer", text: "مرحبا، فما مقاس 38 من هذا؟", time: "09:02" },
      { role: "bot", text: "👋 أهلاً بك! نعم متوفر مقاس 38 باللون الوردي والأبيض.", time: "09:03" },
      { role: "customer", text: "باهي قداش السوم؟", time: "09:03" },
      { role: "bot", text: "💰 السعر هو 79 د.ت.", time: "09:04" },
      { role: "customer", text: "أوكي نحب نطلب واحد أبيض مقاس 38", time: "09:05" },
      { role: "bot", text: "🛍️ ممتاز! يرجى إرسال رقم الهاتف والمدينة لتسجيل الطلب.", time: "09:05" },
      { role: "customer", text: "هاتفي 55456789 تونس العاصمة", time: "09:06" },
      { role: "bot", text: "✅ تم استلام طلبك! سيتم التواصل معك قريباً لتأكيد التوصيل.", time: "09:07" },
    ]
  },
  {
    id: "conv-3",
    customerName: "ياسين الغربي",
    phoneNumber: "+216 22 789 123",
    createdAt: "2026-07-04T18:22:00Z",
    status: "cancelled",
    trustScore: 32,
    lastMessage: "سومو غالي برشا شكرا",
    messages: [
      { role: "customer", text: "السلام عليكم، قداش السوم؟", time: "18:19" },
      { role: "bot", text: "💰 السعر هو 79 د.ت. متوفر التوصيل لكافة الولايات.", time: "18:20" },
      { role: "customer", text: "سومو غالي برشا شكرا", time: "18:21" },
      { role: "bot", text: "نشكرك على تواصلك معنا، في خدمتكم دائماً!", time: "18:22" },
    ]
  }
];

export default function Products() {
  const { t, dir } = useLanguage();
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const [activeBotProduct, setActiveBotProduct] = useState<Product | null>(null);
  const [botInstructions, setBotInstructions] = useState("");
  const [selectedFakeConv, setSelectedFakeConv] = useState<any | null>(null);

  const ordersQuery = trpc.orders.list.useQuery({});


  const { data: products = [], isLoading, error, refetch } = trpc.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const botStatus = trpc.socialSellers.botStatus.useQuery();
  const importMutation = trpc.socialSellers.importFacebookProducts.useMutation({
    onSuccess: (res: any) => {
      utils.products.list.invalidate();
      toast.success(res.message);
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const fbConnected = botStatus.data?.connected === true;
  const PAGE_SIZE = 15;
  const productsTyped = products as Product[];

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success(t("products.add"));
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success(t("products.edit"));
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filteredProducts = useMemo(() => productsTyped.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category?.toLowerCase().includes(search.toLowerCase()))
  ), [productsTyped, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const closeDialog = () => { setDialogOpen(false); resetForm(); };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const scrapeMutation = trpc.products.scrapeFromUrl.useMutation({
    onSuccess: (data: any) => {
      setForm({
        name: data.name || "",
        description: data.description || "",
        price: data.price ? String(data.price) : "",
        category: data.category || "",
        imageUrl: data.imageUrl || "",
        fbIgEnabled: true,
        fbIgQuestions: [],
      });
      setEditingId(null);
      setUrlDialogOpen(false);
      setImportUrl("");
      setDialogOpen(true);
      toast.success(t("products.importFromUrl"));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category || "",
      imageUrl: product.imageUrl || "",
      fbIgEnabled: product.fbIgEnabled ?? false,
      fbIgQuestions: Array.isArray((product as any).fbIgQuestions) ? (product as any).fbIgQuestions.map((q: any) => ({
        label: q.label || "",
        type: q.type || "text",
        options: Array.isArray(q.options) ? q.options.join(", ") : q.options || "",
        required: q.required ?? true,
      })) : [],
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) { toast.error(t("products.price")); return; }

    const questions = (form.fbIgQuestions || []).filter(q => q.label.trim()).map(q => ({
      label: q.label,
      type: q.type,
      options: q.type === "select" ? q.options?.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      required: q.required ?? true,
    }));

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        description: form.description || undefined,
        price: priceNum,
        category: form.category || undefined,
        imageUrl: form.imageUrl || undefined,
        fbIgEnabled: form.fbIgEnabled,
        fbIgQuestions: questions.length > 0 ? questions : undefined,
        fbIgOptions: undefined,
      });
    } else {
      createMutation.mutate({
        name: form.name,
        description: form.description || undefined,
        price: priceNum,
        category: form.category || undefined,
        imageUrl: form.imageUrl || undefined,
        fbIgEnabled: form.fbIgEnabled,
        fbIgQuestions: questions.length > 0 ? questions : undefined,
        fbIgOptions: undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-10 w-64" />
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-xl" />
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("common.error")}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>{t("dashboard.retry")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("products.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("products.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          {fbConnected && (
            <>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => importMutation.mutate()} disabled={importMutation.isPending}>
                {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {t("products.importFromFacebook")}
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setUrlDialogOpen(true)}>
                <Link className="w-4 h-4" />{t("products.importFromUrl")}
              </Button>
            </>
          )}
          <Button size="sm" className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" />{t("products.add")}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder={t("products.search")} className="ps-9" />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="text-center py-16">
            <Package className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{search ? t("common.noData") : t("products.noProducts")}</p>
            {!search && <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}><Plus className="w-4 h-4 ms-1" />{t("products.add")}</Button>}
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
                    <TableHead className="text-start">{t("products.name")}</TableHead>
                    <TableHead className="text-start">{t("products.category")}</TableHead>
                    <TableHead className="text-start">{t("products.price")}</TableHead>
                    {fbConnected && <TableHead className="text-start">{t("products.botEnabled")}</TableHead>}
                    <TableHead className="text-start">{t("common.edit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                      <TableCell>
                        {product.category ? (
                          <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                        ) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="font-semibold">{product.price.toFixed(2)} {t("orders.currencyTnd")}</TableCell>
                      {fbConnected && (
                        <TableCell>
                          {(product as any).fbIgEnabled ? (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {t("products.botEnabled")}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground/50 text-xs">—</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-start">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-accent hover:text-accent/80"
                            onClick={() => {
                              setActiveBotProduct(product);
                              setBotInstructions((product.fbIgOptions as any)?.customPrompt ?? "");
                            }}
                            title="إعدادات البوت والتحويل"
                          >
                            <Bot className="w-4.5 h-4.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(product)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground" dir="ltr">
                  {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredProducts.length)} / {filteredProducts.length}
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

      {/* Import from URL dialog */}
      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
        <DialogContent dir={dir} className="p-0 gap-0 sm:max-w-lg">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2"><Link className="w-4 h-4" />{t("products.importFromUrl")}</DialogTitle>
            <DialogDescription>{t("products.importUrlDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (importUrl.trim()) scrapeMutation.mutate({ url: importUrl.trim() }); }} className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-url">{t("products.imageUrl")}</Label>
              <Input id="import-url" type="url" value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder={t("products.importUrlPlaceholder")} required />
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild><Button type="button" variant="outline">{t("common.cancel")}</Button></DialogClose>
              <Button type="submit" disabled={scrapeMutation.isPending || !importUrl.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                {scrapeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                {t("products.importUrlBtn")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product form dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={dir} className="p-0 gap-0" style={{ maxWidth: "calc(100% - 4rem)" }}>
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{editingId ? t("products.edit") : t("products.addNew")}</DialogTitle>
            <DialogDescription>{t("products.subtitle")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor="p-name">{t("products.name")}</Label>
              <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-desc">{t("products.description")}</Label>
              <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder={t("products.description")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-price">{t("products.price")} ({t("orders.currencyTnd")})</Label>
                <Input id="p-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-category">{t("products.category")}</Label>
                <Input id="p-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-image">{t("products.imageUrl")}</Label>
              <Input id="p-image" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("products.botToggle")}</p>
                  <p className="text-xs text-muted-foreground">يظهر المنتج في بوت المسنجر</p>
                </div>
              </div>
              <Switch
                checked={form.fbIgEnabled}
                onCheckedChange={(c) => setForm({ ...form, fbIgEnabled: c })}
              />
            </div>

            {form.fbIgEnabled && (
              <div className="rounded-lg border bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{t("products.botQuestions")}</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setForm(f => ({ ...f, fbIgQuestions: [...(f.fbIgQuestions || []), { label: "", type: "text" as const, options: "", required: true }] }))}
                  >
                    <Plus className="w-4 h-4 ms-1" />{t("products.addQuestion")}
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {(form.fbIgQuestions || []).map((q, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">{t("products.questionLabel")}</Label>
                            <Input
                              value={q.label}
                              onChange={e => {
                                const copy = [...(form.fbIgQuestions || [])];
                                copy[i] = { ...copy[i], label: e.target.value };
                                setForm(f => ({ ...f, fbIgQuestions: copy }));
                              }}
                              placeholder="مثلاً: اختر المقاس"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t("products.questionType")}</Label>
                            <select
                              value={q.type}
                              onChange={e => {
                                const copy = [...(form.fbIgQuestions || [])];
                                copy[i] = { ...copy[i], type: e.target.value as any };
                                setForm(f => ({ ...f, fbIgQuestions: copy }));
                              }}
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                              <option value="text">{t("products.questionText")}</option>
                              <option value="number">{t("products.questionNumber")}</option>
                              <option value="select">{t("products.questionSelect")}</option>
                            </select>
                          </div>
                        </div>
                        {q.type === "select" && (
                          <div>
                            <Label className="text-xs">{t("products.questionOptions")}</Label>
                            <Input
                              value={q.options || ""}
                              onChange={e => {
                                const copy = [...(form.fbIgQuestions || [])];
                                copy[i] = { ...copy[i], options: e.target.value };
                                setForm(f => ({ ...f, fbIgQuestions: copy }));
                              }}
                              placeholder="S, M, L, XL"
                              className="h-8 text-sm"
                            />
                          </div>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.required ?? true}
                            onChange={e => {
                              const copy = [...(form.fbIgQuestions || [])];
                              copy[i] = { ...copy[i], required: e.target.checked };
                              setForm(f => ({ ...f, fbIgQuestions: copy }));
                            }}
                            className="rounded border-border"
                          />
                          <span className="text-xs text-muted-foreground">{t("products.questionRequired")}</span>
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const copy = [...(form.fbIgQuestions || [])];
                          copy.splice(i, 1);
                          setForm(f => ({ ...f, fbIgQuestions: copy }));
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {(form.fbIgQuestions || []).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">{t("products.botQuestionsDesc")}</p>
                  )}
                </div>
              </div>
            )}

            </div>

            <div className="flex flex-col gap-2 sm:flex-row justify-end border-t px-6 py-4 bg-background">
              <DialogClose asChild><Button type="button" variant="outline">{t("common.cancel")}</Button></DialogClose>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {t("common.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bot Panel / Drawer */}
      {activeBotProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200" dir={dir}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setActiveBotProduct(null);
              setSelectedFakeConv(null);
            }}
          />

          {/* Drawer Body - 70% to 75% of screen width */}
          <div className="relative w-full lg:w-[75%] max-w-6xl bg-background shadow-2xl h-full flex flex-col border-s border-border animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <Bot className="w-5 h-5 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">مساعد المنتجات الذكي & التحليلات</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeBotProduct.name} — {activeBotProduct.price.toFixed(2)} د.ت</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveBotProduct(null);
                  setSelectedFakeConv(null);
                }}
              >
                إغلاق
              </Button>
            </div>

            {/* Split Screen Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
              {/* Left Column: Settings (col-span-5) */}
              <div className="lg:col-span-5 flex flex-col p-6 space-y-6 overflow-y-auto border-e border-border/60 h-full bg-muted/5">
                {/* Product Conversion Analytics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    مؤشرات التحويل للمنتج (Product Conversion)
                  </h4>
                  <div className="grid grid-cols-3 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">معدل التحويل</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {Math.round(((activeBotProduct.name.length * 3) % 15) + 12)}%
                      </p>
                    </div>
                    <div className="text-center border-x border-border/50">
                      <p className="text-xs text-muted-foreground">المحادثات</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {Math.round(((activeBotProduct.name.length * 7) % 40) + 15)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">الطلبات</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {Math.floor(Math.round(((activeBotProduct.name.length * 7) % 40) + 15) * 0.15) + 1}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.round(((activeBotProduct.name.length * 3) % 15) + 12)}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-border/50 my-6" />

                {/* Bot Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-accent" />
                    إعدادات الرد والتفعيل
                  </h4>

                  {/* Toggle Bot Catalog */}
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-xs">
                    <div>
                      <p className="text-sm font-medium text-foreground">تفعيل المنتج في كتالوج البوت</p>
                      <p className="text-xs text-muted-foreground mt-0.5">عند التفعيل، يستطيع المشترون تصفح وشراء المنتج آلياً عبر البوت.</p>
                    </div>
                    <Switch
                      checked={activeBotProduct.fbIgEnabled}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: activeBotProduct.id,
                          fbIgEnabled: checked,
                        }, {
                          onSuccess: (res: any) => {
                            toast.success(checked ? "تم تفعيل المنتج في البوت" : "تم إلغاء تفعيل المنتج في البوت");
                            setActiveBotProduct(res as any);
                          }
                        });
                      }}
                    />
                  </div>

                  {/* Custom prompt guidelines */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">تعليمات وتوجيهات الذكاء الاصطناعي للمنتج</Label>
                    <Textarea
                      value={botInstructions}
                      onChange={(e) => setBotInstructions(e.target.value)}
                      placeholder="مثال: هذا الحذاء متوفر فقط باللون الأسود والبني، المقاسات من 40 إلى 44. التوصيل مجاني لثلاثة أزواج أو أكثر."
                      className="min-h-[120px] text-sm leading-relaxed"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      💡 اكتب تفاصيل مخصصة (الألوان المتوفرة، المقاسات، الميزات...) ليقوم مساعد الذكاء الاصطناعي بالاعتماد عليها عند إجابة المشتري عن تفاصيل هذا المنتج.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5 h-10 font-bold mt-4"
                    onClick={() => {
                      const opts = { ...(activeBotProduct.fbIgOptions as any || {}), customPrompt: botInstructions };
                      updateMutation.mutate({
                        id: activeBotProduct.id,
                        fbIgOptions: opts,
                      }, {
                        onSuccess: (res: any) => {
                          toast.success("تم حفظ إرشادات البوت بنجاح");
                          setActiveBotProduct(res as any);
                        }
                      });
                    }}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ إعدادات البوت
                  </Button>
                </div>
              </div>

              {/* Right Column: Conversions List & Chat Window (col-span-7) */}
              <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-card">
                {!selectedFakeConv ? (
                  /* Case A: Show Conversions / Customer List */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-muted/5 flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        قائمة المشترين الذين تم تحويلهم ({FAKE_CONVERSIONS.length})
                      </h4>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">بيانات توضيحية (Mock UI)</Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {FAKE_CONVERSIONS.map((conv) => (
                        <div
                          key={conv.id}
                          className="p-4 rounded-xl border border-border/80 bg-background shadow-xs hover:border-accent/40 hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => setSelectedFakeConv(conv)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-bold text-foreground group-hover:text-accent transition-colors">{conv.customerName}</p>
                              <p className="text-xs text-muted-foreground font-mono" dir="ltr">{conv.phoneNumber}</p>
                            </div>
                            <div className="text-end space-y-1.5">
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                                conv.status === "confirmed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                                conv.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" :
                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                              )}>
                                {conv.status === "confirmed" ? "مؤكد" : conv.status === "delivered" ? "تم التوصيل" : "ملغي"}
                              </span>
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-[10px] text-muted-foreground">الثقة:</span>
                                <span className={cn(
                                  "text-[11px] font-bold",
                                  conv.trustScore >= 70 ? "text-green-600" : conv.trustScore >= 40 ? "text-amber-500" : "text-red-500"
                                )}>
                                  {conv.trustScore}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Last message quote */}
                          <div className="mt-3 pt-3 border-t border-dashed border-border flex items-center justify-between text-xs">
                            <p className="text-muted-foreground truncate italic flex-1 max-w-[280px]">
                              💬 "{conv.lastMessage}"
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(conv.createdAt).toLocaleDateString("ar-TN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Case B: Show Live Bot Conversation Logs */
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    {/* Customer Chat Header */}
                    <div className="p-4 border-b border-border/50 bg-muted/15 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFakeConv(null)}
                        className="gap-1 text-xs"
                      >
                        {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        رجوع للعملاء
                      </Button>
                      <div className="text-center">
                        <p className="font-bold text-sm text-foreground">{selectedFakeConv.customerName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selectedFakeConv.phoneNumber}</p>
                      </div>
                      <div className="text-end">
                        <span className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          selectedFakeConv.status === "confirmed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                          selectedFakeConv.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                        )}>
                          {selectedFakeConv.status === "confirmed" ? "مؤكد" : selectedFakeConv.status === "delivered" ? "تم التوصيل" : "ملغي"}
                        </span>
                      </div>
                    </div>

                    {/* Chat Bubble History Container */}
                    <div className="flex-1 overflow-y-auto p-4 bg-muted/5 space-y-4">
                      {selectedFakeConv.messages.map((m: any, i: number) => {
                        const isBot = m.role === "bot";
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex w-full",
                              isBot ? "justify-start" : "justify-end"
                            )}
                          >
                            <div className="max-w-[85%] space-y-1">
                              <div
                                className={cn(
                                  "p-3 rounded-2xl text-xs whitespace-pre-line shadow-xs leading-relaxed",
                                  isBot
                                    ? "bg-accent/15 text-foreground rounded-tl-none border border-accent/10"
                                    : "bg-primary text-primary-foreground rounded-tr-none"
                                )}
                              >
                                {m.text}
                              </div>
                              <p className={cn("text-[9px] text-muted-foreground px-1", isBot ? "text-start" : "text-end")}>
                                {m.time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dummy Chat Input to round up UI */}
                    <div className="p-3 border-t bg-muted/5 flex items-center gap-2">
                      <Input
                        disabled
                        placeholder="البوت يتحكم في المحادثة حالياً..."
                        className="text-xs bg-muted/50 cursor-not-allowed"
                      />
                      <Button size="sm" disabled className="text-xs h-9 cursor-not-allowed">إرسال</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
