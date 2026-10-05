import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    company: z.string(),
    role: z.string(),
    period: z.string(),
    order: z.number(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })),
    stack: z.array(z.string()),
  }),
});

export const collections = { work };
