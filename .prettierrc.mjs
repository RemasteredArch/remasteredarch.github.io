/** @type { import("prettier").Config } */
export default {
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
        {
            files: "*.md",
            options: {
                embeddedLanguageFormatting: "off",
            },
        },
    ],
    bracketSameLine: true,
};
