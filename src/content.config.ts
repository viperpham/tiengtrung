import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] as const;

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    level: z.enum(LEVELS),
    order: z.number().default(99),
    description: z.string().optional(),
  }),
});

const vocabulary = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/vocabulary' }),
  schema: z.object({
    hanzi: z.string(),
    pinyin: z.string(),
    meaning_vi: z.string(),
    meaning_en: z.string().optional(),
    level: z.enum(LEVELS),
    lesson: z.string().optional(),
    audio: z.string().optional(),
    example_sentence: z.string().optional(),
    example_pinyin: z.string().optional(),
    example_meaning: z.string().optional(),
    order: z.number().default(99),
  }),
});

const grammar = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/grammar' }),
  schema: z.object({
    title: z.string(),
    level: z.enum(LEVELS),
    lesson: z.string().optional(),
    structure: z.string(),
    explanation: z.string(),
    examples: z
      .array(z.object({ hanzi: z.string(), pinyin: z.string(), meaning: z.string() }))
      .default([]),
  }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/quizzes' }),
  schema: z.object({
    title: z.string(),
    level: z.enum(LEVELS),
    lesson: z.string().optional(),
    questions: z
      .array(
        z.object({
          question: z.string(),
          hint_audio: z.string().optional(),
          options: z.array(z.string()).min(2),
          answer: z.number().int().min(0),
          explanation: z.string().optional(),
        }),
      )
      .min(1),
  }),
});

export const collections = { lessons, vocabulary, grammar, quizzes };
