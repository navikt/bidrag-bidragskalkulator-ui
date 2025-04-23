import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      tailwindcss(),
      reactRouterDevTools(),
      reactRouter(),
      tsconfigPaths(),
    ],
    define: {
      "import.meta.env.UMAMI_WEBSITE_ID": JSON.stringify(env.UMAMI_WEBSITE_ID),
      "import.meta.env.ENVIRONMENT": JSON.stringify(env.ENVIRONMENT),
    },
  };
});
