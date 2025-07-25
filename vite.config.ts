import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/barnebidrag/tjenester/",
  plugins: [
    tailwindcss(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    hmr: {
      path: "/",
      clientPort: 5173,
      host: "localhost",
    },
  },
});
