import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Package,
  Phone,
  Plug,
  Settings,
  Shield,
  FileText,
  Users,
  Gift,
  BarChart3,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const dashboardMenuIconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  orders: Package,
  "phone-verification": Phone,
  reports: FileText,
  credits: Gift,
  referrals: Users,
  analytics: BarChart3,
  plugins: Plug,
  settings: Settings,
  support: HelpCircle,
};

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path?: string;
  subItems?: { label: string; path: string }[];
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

function useDashboardMenuGroups(): MenuGroup[] {
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const apiGroups = appContent?.dashboard?.menuGroups;
  return useMemo(() => {
    if (!apiGroups?.length) {
      return [
        {
          label: "الرئيسية",
          items: [
            { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
          ],
        },
        {
          label: "الطلبات والتحقق",
          items: [
            { icon: Package, label: "الطلبات", path: "/orders" },
            { icon: Phone, label: "التحقق من الهاتف", path: "/phone-verification" },
          ],
        },
        {
          label: "التقارير والاعتمادات",
          items: [
            { icon: FileText, label: "التقارير", path: "/reports" },
            { icon: Gift, label: "الاعتمادات", path: "/credits" },
            { icon: Users, label: "الإحالات", path: "/referrals" },
          ],
        },
        {
          label: "الإحصائيات والتحليلات",
          items: [
            { icon: BarChart3, label: "الإحصائيات", path: "/analytics" },
          ],
        },
        {
          label: "التكامل والإعدادات",
          items: [
            {
              icon: Plug,
              label: "الإضافات",
              path: "/plugins",
              subItems: [
                { label: "كل الإضافات", path: "/plugins" },
                { label: "حلول فيسبوك وإنستغرام", path: "/plugins/social-sellers" },
              ],
            },
            { icon: Settings, label: "الإعدادات", path: "/settings" },
          ],
        },
        {
          label: "المساعدة والدعم",
          items: [
            {
              icon: HelpCircle,
              label: "الدعم",
              path: "/support",
              subItems: [
                { label: "اتصل بنا", path: "/support/contact" },
                { label: "الإبلاغ عن مشكلة", path: "/support/report" },
              ],
            },
          ],
        },
      ];
    }
    return apiGroups.map(group => ({
      label: group.label,
      items: group.items.map(item => {
        const i = item as { id: string; label: string; path: string; subItems?: { label: string; path: string }[] };
        return {
          icon: dashboardMenuIconMap[i.id] ?? LayoutDashboard,
          label: i.label,
          path: i.path,
          subItems: i.subItems,
        };
      }),
    }));
  }, [apiGroups]);
}

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading } = useAuth({ redirectOnUnauthenticated: true });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  return (
    <SidebarProvider
      dir="ltr"
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [location, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const menuGroups = useDashboardMenuGroups();
  const brandName = appContent?.dashboard?.brandName ?? "Tunisia Trust Engine";
  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };
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
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemLabel)) {
        next.delete(itemLabel);
      } else {
        next.add(itemLabel);
      }
      return next;
    });
  };

  // Auto-expand items with active sub-items
  useEffect(() => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (item.subItems?.some(sub => sub.path === location)) {
          setExpandedItems(prev => new Set(prev).add(item.label));
        }
      }
    }
  }, [location]);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

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
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold tracking-tight truncate">
                    {brandName}
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-3 overflow-auto">
            {menuGroups.map((group, groupIndex) => (
              <SidebarGroup
                key={groupIndex}
                className="mb-3 shrink-0 flex-none"
              >
                <SidebarGroupContent className="flex flex-col gap-1">
                  {group.items.map(item => {
                    const isActive =
                      location === item.path ||
                      item.subItems?.some(sub => sub.path === location);
                    const isExpanded = expandedItems.has(item.label);
                    const hasSubItems =
                      item.subItems && item.subItems.length > 0;

                    return (
                      <div
                        key={item.path || item.label}
                        className="w-full flex-none"
                      >
                        <SidebarMenuButton
                          isActive={isActive && !hasSubItems}
                          onClick={() => {
                            if (hasSubItems) {
                              toggleExpanded(item.label);
                            } else if (item.path) {
                              setLocation(item.path);
                            }
                          }}
                          tooltip={item.label}
                          className="w-full"
                        >
                          <item.icon
                            className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`}
                          />
                          <span className="flex-1 text-right">
                            {item.label}
                          </span>
                          {hasSubItems && (
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          )}
                        </SidebarMenuButton>
                        {hasSubItems &&
                          isExpanded &&
                          (item.subItems ?? []).length > 0 && (
                            <div className="mt-3 ml-6 flex flex-col gap-2 pb-1">
                              {(item.subItems ?? []).map(subItem => {
                                const isSubActive = location === subItem.path;
                                return (
                                  <button
                                    key={subItem.path}
                                    onClick={e => {
                                      e.preventDefault();
                                      setLocation(subItem.path);
                                    }}
                                    className={`w-full min-h-[2.25rem] flex items-center text-right px-3 py-2 rounded-md text-sm transition-colors ${
                                      isSubActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                                    }`}
                                  >
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

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-right group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  dir="rtl"
                >
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.fullName || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset dir="rtl">
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}
