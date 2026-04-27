import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ApiEndpoint = {
  method: string;
  path: string;
  title: string;
  desc: string;
  body?: string;
  response?: string;
  params?: { name: string; type: string; desc: string }[];
};

type EndpointDetailsProps = {
  id: string;
  endpoint: ApiEndpoint;
  baseUrl: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
};

export function EndpointDetails({
  id,
  endpoint,
  baseUrl,
  copied,
  onCopy,
}: EndpointDetailsProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-14">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            endpoint.method === "GET"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {endpoint.method}
        </span>
        <code className="text-slate-700 font-mono text-sm bg-slate-100 px-2 py-1 rounded">
          {baseUrl}
          {endpoint.path}
        </code>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {endpoint.title}
      </h2>
      <p className="text-slate-600 leading-relaxed mb-4">{endpoint.desc}</p>
      {endpoint.params && endpoint.params.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            المعاملات
          </h3>
          <ul className="space-y-1 text-sm text-slate-600">
            {endpoint.params.map((param) => (
              <li key={param.name} className="flex gap-2">
                <code className="shrink-0 text-slate-800 font-mono">
                  {param.name}
                </code>
                <span className="text-slate-500">({param.type})</span>
                <span>— {param.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {endpoint.body && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            جسم الطلب (Request Body)
          </h3>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-slate-900 text-slate-300 text-sm overflow-x-auto font-mono">
              {endpoint.body}
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 text-slate-400 hover:text-white"
              onClick={() => onCopy(endpoint.body!, id)}
            >
              {copied === id ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
      {endpoint.response && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            مثال الاستجابة (Response)
          </h3>
          <pre className="p-4 rounded-lg bg-slate-100 text-slate-700 text-sm overflow-x-auto font-mono border border-slate-200">
            {endpoint.response}
          </pre>
        </div>
      )}
    </section>
  );
}
