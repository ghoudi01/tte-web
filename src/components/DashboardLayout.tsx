import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { YakeenLogo } from "@/components/YakeenLogo";
import {
  LayoutDashboard, LogOut, PanelLeft, Package, Phone, Plug, Settings,
  Shield, FileText, Users, Gift, BarChart3, HelpCircle, ChevronRight,
  Tag, Sun, Moon, Globe, ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import type { Lang } from "@/lib/i18n";

const dashboardMenuIconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard, orders: Package, products: Tag,
  "phone-verification": Phone, reports: FileText, credits: Gift,
  referrals: Users, analytics: BarChart3, plugins: Plug,
  settings: Settings, support: HelpCircle,
};

type MenuItem = { icon: LucideIcon; label: string; path?: string; subItems?: { label: string; path: string }[] };
type MenuGroup = { label: string; items: MenuItem[] };

const LANG_LABELS: Record<Lang, string> = { ar: "العربية", fr: "Français", en: "English" };
const LANG_FLAGS: Record<Lang, string> = { ar: "🇹🇳", fr: "🇫🇷", en: "🇬🇧" };

function useDashboardMenuGroups(): MenuGroup[] {
  const { t } = useLanguage();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const apiGroups = appContent?.dashboard?.menuGroups;
  return useMemo(() => {
    if (!apiGroups?.length) {
      return [
        { label: t("sidebar.main"), items: [{ icon: LayoutDashboard, label: t("sidebar.dashboard"), path: "/dashboard" }, { icon: BarChart3, label: t("sidebar.analytics"), path: "/analytics" }] },
        { label: t("sidebar.orders"), items: [{ icon: Tag, label: t("sidebar.products"), path: "/products" }, { icon: Package, label: t("sidebar.orders"), path: "/orders" }, { icon: FileText, label: t("sidebar.reports"), path: "/reports" }] },
        { label: t("sidebar.phoneVerification"), items: [{ icon: Phone, label: t("sidebar.phoneVerification"), path: "/phone-verification" }] },
        { label: t("sidebar.credits"), items: [{ icon: Gift, label: t("sidebar.credits"), path: "/credits" }, { icon: Users, label: t("sidebar.referrals"), path: "/referrals" }] },
        { label: t("sidebar.settings"), items: [{ icon: Plug, label: t("sidebar.plugins"), path: "/plugins" }, { icon: Settings, label: t("sidebar.settings"), path: "/settings" }, { icon: HelpCircle, label: t("sidebar.support"), path: "/support", subItems: [{ label: t("sidebar.contact"), path: "/support/contact" }, { label: t("sidebar.reportProblem"), path: "/support/report" }] }] },
      ];
    }
    return apiGroups.map((group: any) => ({
      label: group.label,
      items: group.items.map((item: any) => {
        const i = item as { id: string; label: string; path: string; subItems?: { label: string; path: string }[] };
        return { icon: dashboardMenuIconMap[i.id] ?? LayoutDashboard, label: i.label, path: i.path, subItems: i.subItems };
      }),
    }));
  }, [apiGroups, t]);
}

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

type SessionUser = { id: string; email: string; role: "admin" | "merchant"; emailVerified?: boolean; notificationsUnread?: number };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout: logoutAuth } = useAuth({ redirectOnUnauthenticated: true });
  const { dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);

  const handleLogout = async () => { await logoutAuth(); setLocation("/login"); };

  if (loading || !user) return <DashboardLayoutSkeleton />;

  return (
      <SidebarProvider
          dir={dir}
          style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
        >
      <DashboardLayoutContent user={user as SessionUser} setSidebarWidth={setSidebarWidth} onLogout={handleLogout}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children, setSidebarWidth, user, onLogout }: {
  children: React.ReactNode; setSidebarWidth: (width: number) => void; user: SessionUser; onLogout: () => void | Promise<void>;
}) {
  const { t, lang, setLang, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const displayName = user.email.includes("@") ? user.email.split("@")[0] : user.email;
  const [location, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const baseMenuGroups = useDashboardMenuGroups();
  const menuGroups = useMemo(() => {
    if (user.role !== "admin") return baseMenuGroups;
    return [...baseMenuGroups, { label: t("sidebar.admin"), items: [{ icon: Shield, label: t("sidebar.adminReports"), path: "/admin/reports" }] }];
  }, [baseMenuGroups, user.role, t]);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const sidebarRef = useRef<HTMLDivElement>(null);

  const findActiveMenuItem = () => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (item.path === location) return item;
        if (item.subItems?.some(sub => sub.path === location)) return item;
      }
    }
    return null;
  };
  const activeMenuItem = findActiveMenuItem();
  const isMobile = useIsMobile();
  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => { const n = new Set(prev); n.has(itemLabel) ? n.delete(itemLabel) : n.add(itemLabel); return n; });
  };

  useEffect(() => {
    for (const g of menuGroups) for (const item of g.items)
      if (item.subItems?.some(sub => sub.path === location))
        setExpandedItems(prev => new Set(prev).add(item.label));
  }, [location, menuGroups]);

  useEffect(() => { if (isCollapsed) setIsResizing(false); }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar side={dir === "rtl" ? "right" : "left"} collapsible="icon" className="border-l-0 border-r-0" disableTransition={isResizing}>
          <SidebarHeader className={`h-16 justify-center border-b border-sidebar-border/50 ${isCollapsed ? "p-2" : "px-4"}`}>
            <div className="flex items-center transition-all w-full">
              <div className={`flex-1 flex items-center gap-3 ${isCollapsed ? "hidden" : ""}`}>
                <YakeenLogo size={40} showText compact />
              </div>
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-sidebar-accent/20 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring shrink-0"
                aria-label={t("sidebar.main")}
              >
                <PanelLeft className={`h-4 w-4 text-sidebar-foreground/60 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
              </button>
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-1 overflow-auto px-1 pt-3">
            {menuGroups.map((group, groupIndex) => (
              <SidebarGroup key={groupIndex} className="shrink-0 flex-none">
                <SidebarGroupContent className="flex flex-col gap-0.5">
                  {group.items.map(item => {
                    const isActive = location === item.path || item.subItems?.some(sub => sub.path === location);
                    const isExpanded = expandedItems.has(item.label);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    return (
                      <div key={item.path || item.label} className="w-full flex-none">
                        <SidebarMenuButton isActive={isActive && !hasSubItems} onClick={() => hasSubItems ? toggleExpanded(item.label) : item.path && setLocation(item.path)} tooltip={item.label} className="w-full">
                          <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"}`} />
                          <span className={`flex-1 ${dir === "rtl" ? "text-right" : "text-left"}`}>{item.label}</span>
                          {hasSubItems && <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : dir === "rtl" ? "rotate-180" : ""}`} />}
                        </SidebarMenuButton>
                        {hasSubItems && isExpanded && (item.subItems ?? []).length > 0 && (
                          <div className={`mt-1 ${dir === "rtl" ? "mr-6" : "ml-6"} flex flex-col gap-0.5 pb-1`}>
                            {(item.subItems ?? []).map(subItem => {
                              const isSubActive = location === subItem.path;
                              return (
                                <button key={subItem.path} onClick={e => { e.preventDefault(); setLocation(subItem.path); }}
                                  className={`w-full min-h-[2.25rem] flex items-center ${dir === "rtl" ? "text-right" : "text-left"} px-3 py-2 rounded-md text-sm transition-colors ${isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50 text-sidebar-foreground"}`}>
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-3 space-y-3 border-t border-border/50">
            {/* Theme + Language Toggles */}
            <div className={`flex items-center ${isCollapsed ? "justify-center gap-3" : "justify-between gap-2 px-1"}`}>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 rounded-lg" title={theme === "light" ? t("common.darkMode") : t("common.lightMode")}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={`h-8 gap-1 px-2 text-xs rounded-lg ${isCollapsed ? "hidden" : ""}`}>
                    <Globe className="h-3.5 w-3.5" />
                    <span>{LANG_LABELS[lang]}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-36">
                  {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
                    <DropdownMenuItem key={l} onClick={() => setLang(l)} className={`cursor-pointer ${lang === l ? "font-bold bg-accent/20" : ""}`}>
                      {LANG_FLAGS[l]} {LANG_LABELS[l]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors w-full ${dir === "rtl" ? "text-right" : "text-left"} group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring`}>
                  <Avatar className="h-9 w-9 border-2 border-sidebar-border shrink-0">
                    <AvatarFallback className="text-xs font-medium bg-sidebar-accent text-sidebar-accent-foreground">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold truncate leading-none">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-48">
                <DropdownMenuItem onClick={() => void onLogout()} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-4 w-4`} />
                  <span>{t("sidebar.signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className={`absolute top-0 ${dir === "rtl" ? "left-0 right-auto" : "right-0 left-auto"} w-1 h-full cursor-col-resize hover:bg-sidebar-primary/30 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => { if (isCollapsed) return; setIsResizing(true); }} style={{ zIndex: 50 }} />
      </div>

      <SidebarInset dir={dir} className={location === "/reports/quick" ? "min-h-0" : ""}>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background border border-border/50" />
              <span className="text-sm font-semibold text-foreground">{activeMenuItem?.label ?? t("sidebar.dashboard")}</span>
            </div>
          </div>
        )}
        <main className={cn(location !== "/reports/quick" ? "flex-1 p-4 md:p-6" : "flex-1 relative")}>{children}</main>
      </SidebarInset>
    </>
  );
}
