import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Library besar dipisah biar bisa di-cache & tidak nge-block halaman
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion": ["framer-motion"],
          "supabase": ["@supabase/supabase-js"],
          "icons": ["lucide-react", "simple-icons", "react-simple-icons"],
        },
      },
    },
  },

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