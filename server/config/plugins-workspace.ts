import { promises as fs } from "node:fs";
import path from "node:path";

export type PluginManifest = {
  name: string;
  version: string;
  description: string;
  entry: string;
  capabilities: string[];
};

export async function loadPluginManifests(): Promise<PluginManifest[]> {
  const pluginsRoot = path.resolve(process.cwd(), "..", "plugins");
  try {
    const dirs = await fs.readdir(pluginsRoot, { withFileTypes: true });
    const manifests: PluginManifest[] = [];

    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;
      const manifestPath = path.join(pluginsRoot, dir.name, "plugin.json");
      try {
        const raw = await fs.readFile(manifestPath, "utf8");
        manifests.push(JSON.parse(raw) as PluginManifest);
      } catch {
        // ignore folders without plugin manifest
      }
    }

    return manifests;
  } catch {
    return [];
  }
}
