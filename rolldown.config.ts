import { defineConfig } from "rolldown";

export default defineConfig({
  platform: "node",
  input: "src/setup-rdflint.ts",
  output: {
    file: "dist/index.js",
  },
});
