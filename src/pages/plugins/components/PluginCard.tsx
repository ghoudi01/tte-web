import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type PluginCatalogItem = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  gradient: string;
  badge: string;
  version: string;
  docsUrl: string;
};

type PluginCardProps = {
  plugin: PluginCatalogItem;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onOpen: (url: string) => void;
};

export function PluginCard({
  plugin,
  isHovered,
  onHover,
  onOpen,
}: PluginCardProps) {
  return (
    <Card
      className={`h-full overflow-hidden border-2 transition-all duration-300 ${
        isHovered
          ? "border-teal-500 shadow-xl shadow-teal-500/10 scale-[1.02]"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
      onMouseEnter={() => onHover(plugin.id)}
      onMouseLeave={() => onHover(null)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.gradient} flex items-center justify-center shadow-lg`}
          >
            <plugin.icon className="w-7 h-7 text-white" />
          </div>
          {plugin.badge && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-teal-100 text-teal-800 border-0"
            >
              {plugin.badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-slate-900">
          {plugin.nameAr}
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          {plugin.description}
        </CardDescription>
        <p className="text-xs text-slate-400 mt-2">الإصدار {plugin.version}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2 mb-6">
          {plugin.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-slate-900 hover:bg-slate-800 rounded-xl font-semibold"
            onClick={() => onOpen(plugin.docsUrl)}
          >
            <Rocket className="w-4 h-4 ml-2" />
            {plugin.id === "api"
              ? "التوثيق والـ API"
              : plugin.id === "socialSellers"
                ? "عرض الحلول"
                : "فتح التوثيق"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl shrink-0"
            onClick={() => onOpen(plugin.docsUrl)}
            aria-label={plugin.id === "api" ? "التوثيق" : "فتح رابط الإضافة"}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
