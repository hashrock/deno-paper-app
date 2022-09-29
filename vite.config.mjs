import { defineConfig } from "npm:vite";
import { viteSingleFile } from "npm:vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSingleFile()],
});
