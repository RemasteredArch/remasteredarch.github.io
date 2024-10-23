import { z as zod, reference, defineCollection } from "astro:content";

const projects = defineCollection({
    type: "data",
    schema: zod.object({
        title: zod.string(),
        description: zod.string(),
        first_commit: zod.date(),
        links: zod.array(
            zod.object({
                type: zod.enum(["git", "blog post", "website"]),
                url: zod.string(),
            }),
        ),
        blog_posts: zod.array(reference("blog")).optional(),
    }),
});

const isoDate = zod.string().datetime({ offset: true, precision: 0 });

const blog = defineCollection({
    type: "content",
    schema: zod.object({
        title: zod.string(),
        description: zod.string(),
        authors: reference("authors").array().min(1),
        published: isoDate,
        last_updated: isoDate.optional(),
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
    type: "data",
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
    type: "data",
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
