import { Router } from "express";
export const pluginApiRouter = Router();

const API_BASE_URL = process.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function proxy(req: any, res: any, path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      "x-api-key": req.headers["x-api-key"] ?? "",
    },
    body: JSON.stringify(req.body ?? {}),
  });
  const data = await response.json();
  res.status(response.status).json(data);
}

pluginApiRouter.post("/orders", (req, res) => proxy(req, res, "/api/plugin/orders"));
pluginApiRouter.post("/reports", (req, res) => proxy(req, res, "/api/plugin/reports"));
