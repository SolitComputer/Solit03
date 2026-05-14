import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      "/wp-json": {
        target: "https://solit03.com",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });

          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Proxying:", req.method, req.url);
          });
        },
      },
    },
  },
});