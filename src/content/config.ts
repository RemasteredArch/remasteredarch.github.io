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

export const collections = {
    projects,
};
