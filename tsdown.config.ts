import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "./src/index.ts",
    dts: true,
    outExtensions: (context) => {
        return {
            js: ".js",
        };
    },
    clean: true,
});
