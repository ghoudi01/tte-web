import express from "express";
import type { Plugin, ViteDevServer } from "vite";
import { pluginApiRouter } from "./server/plugin-api";

/**
 * Custom Vite plugin that mounts the TTE Plugin Express API securely.
 * This establishes standard distinct REST mappings independent of tRPC.
 */
export function ttePluginApi(): Plugin {
  return {
    name: "tte-plugin-api",
    configureServer(server: ViteDevServer) {
      const app = express();
      
      // Allow JSON body parsing
      app.use(express.json());

      // Mount the plugin routers
      app.use("/api/plugin", pluginApiRouter);

      // Webhooks specifically handle Meta / WooCommerce integrations loosely
      app.post("/api/webhooks/meta", (req, res) => {
        // Placeholder for the signature validation integration module
        res.status(200).send("OK");
      });

      // Bind to Vite dev server connecting middleware structure securely
      server.middlewares.use(app);
    },
  };
}
