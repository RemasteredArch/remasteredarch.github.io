// @ts-check
import { defineConfig } from "astro/config";
import { bundledThemes } from "shiki";

const catppuccin_mocha_with_darker_bg = Object.assign(
    { bg: "var(--color-mantle)" },
    (await bundledThemes["catppuccin-mocha"]()).default,
);

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: catppuccin_mocha_with_darker_bg,
        },
    },
});
