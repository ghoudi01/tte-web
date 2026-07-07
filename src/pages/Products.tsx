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
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, Package, Plus, Pencil, Search, MessageCircle, Download, Link, X, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  fbIgEnabled?: boolean;
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


  const { data: products = [], isLoading, error, refetch } = trpc.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const botStatus = trpc.socialSellers.botStatus.useQuery();
  const importMutation = trpc.socialSellers.importFacebookProducts.useMutation({
    onSuccess: (res) => {
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
    onSuccess: (data) => {
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
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(product)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
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
    </div>
  );
}
