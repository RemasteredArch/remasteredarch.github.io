import { glob, type Loader } from "astro/loaders";
import { reference, defineCollection } from "astro:content";
import { z as zod } from "astro/zod";

/**
 * Get the time zones available in the current runtime.
 *
 * @remarks
 *
 * As defined by {@link Intl.supportedValuesOf | `Intl.supportedValuesOf("timeZone")`}.
 *
 * @returns An array (of a length >=1) of time zones for use in {@link Intl.DateTimeFormatOptions}.
 */
function getRuntimeTimeZones(): readonly [string, ...string[]] {
    const timeZonesUnchecked: readonly string[] = Intl.supportedValuesOf("timeZone");
    if (timeZonesUnchecked.length === 0) throw new Error("no time zones available");

    // @ts-ignore We just checked that there is a value at index 0.
    return timeZonesUnchecked;
}

export const rawDateTime = zod.object({
    iso: zod.iso.datetime({ offset: true, precision: 0 }),
    timeZone: zod.enum(getRuntimeTimeZones()),
});

function contentGlob(collectionName: string): Loader {
    return glob({
        base: "./src/content/" + collectionName,
        pattern: "**/*.{md,mdx}",
    });
}

function dataGlob(collectionName: string): Loader {
    return glob({
        base: "./src/content/" + collectionName,
        pattern: "**/*.yaml",
    });
}

const projects = defineCollection({
    loader: dataGlob("projects"),
    schema: zod.object({
        title: zod.string(),
        description: zod.string(),
        first_commit: rawDateTime,
        links: zod.array(
            zod.object({
                type: zod.enum(["git", "blog post", "website"]),
                url: zod.string(),
            }),
        ),
        blog_posts: zod.array(reference("blog")).optional(),
    }),
});

const blog = defineCollection({
    loader: contentGlob("blog"),
    schema: zod.object({
        title: zod.string(),
        description: zod.string(),
        authors: reference("authors").array().min(1),
        published: rawDateTime,
        last_updated: rawDateTime.optional(),
        // Goes in the footer, either as a `LegalItem` or just an arbitrary string.
        extra_legal_disclaimers: zod
            .object({
                project_name: zod.string(),
                project_link: zod.string(),
                license_name: zod.string(),
                license_link: zod.string(),
                copyright_holder: zod.string(),
                copyright_year: zod.string(),
            })
            .or(zod.string())
            .array()
            .optional(),
        tags: zod.array(reference("tags")),
    }),
});

const authors = defineCollection({
    loader: dataGlob("authors"),
    schema: zod.object({
        name: zod.string(),
        contact: zod
            .object({
                email: zod.string().optional(),
                website: zod.string().optional(),
                socials: zod.string().array().optional(),
            })
            .optional(),
    }),
});

const tags = defineCollection({
    loader: dataGlob("tags"),
    schema: zod.object({
        name: zod.string(),
        description: zod.string(),
    }),
});

export const collections = {
    projects,
    blog,
    authors,
    tags,
};
