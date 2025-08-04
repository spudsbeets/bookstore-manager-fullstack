import * as path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               // Vendor chunks
               vendor: ["react", "react-dom", "react-router-dom"],
               ui: [
                  "@radix-ui/react-dialog",
                  "@radix-ui/react-select",
                  "@radix-ui/react-popover",
               ],
               utils: ["date-fns", "zod", "sonner"],
               // Page chunks
               pages: [
                  "./src/Pages/HomePage.tsx",
                  "./src/Pages/BooksPage.tsx",
                  "./src/Pages/CustomersPage.tsx",
                  "./src/Pages/OrdersPage.tsx",
               ],
               forms: [
                  "./src/components/forms/BooksForm.tsx",
                  "./src/components/forms/CustomersForm.tsx",
                  "./src/components/forms/OrdersForm.tsx",
               ],
            },
         },
      },
      chunkSizeWarningLimit: 500,
   },
});
