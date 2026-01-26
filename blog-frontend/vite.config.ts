import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./config", "");

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: "globalThis",
    },
    server: {
      proxy: {
        "/api": {
          target: `http://${env.SERVER_URL}:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
        "/images": {
          target: `http://${env.SERVER_URL}:${env.SERVER_PORT}`,
          changeOrigin: true,
          configure: (proxy) => {
            // 최대 업로드 용량 늘리기
            // @ts-ignore
            proxy.options.bodyLimit = "50mb";

            proxy.on(
              "proxyReq",
              (proxyReq, req: IncomingMessage, res: ServerResponse) => {
                if (!req.url || !env.IMAGE_LOCAL_DIR) return;

                const relativePath = req.url.replace(`${env.IMAGE_PATH}/`, "");
                const imagePath = path.resolve(
                  env.IMAGE_LOCAL_DIR,
                  relativePath,
                );

                if (fs.existsSync(imagePath)) {
                  proxyReq.abort();

                  const stat = fs.statSync(imagePath);
                  const ext = path.extname(imagePath).toLowerCase();
                  const contentType =
                    {
                      ".png": "image/png",
                      ".gif": "image/gif",
                      ".webp": "image/webp",
                      ".jpg": "image/jpeg",
                      ".jpeg": "image/jpeg",
                    }[ext] || "application/octet-stream";

                  res.writeHead(200, {
                    "Content-Type": contentType,
                    "Content-Length": stat.size,
                  });
                  fs.createReadStream(imagePath).pipe(res);
                }
              },
            );
          },
        },
      },
    },
  });
});
