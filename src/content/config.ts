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

const blog = defineCollection({
    type: "content",
    schema: zod.object({
        title: zod.string(),
        description: zod.string(),
        published: zod.date(),
        last_updated: zod.date(),
        tags: zod.array(reference("tags")),
    }),
});

const tags = defineCollection({
    type: "data",
    schema: zod.object({
        name: zod.string(),
        description: zod.string(),
        slug: zod.string(),
    }),
});

export const collections = {
    projects,
    blog,
    tags,
};
