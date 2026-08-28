import { getCollection } from 'astro:content';

export async function GET() {
  const [vocabulary, quizzes] = await Promise.all([
    getCollection('vocabulary'),
    getCollection('quizzes'),
  ]);

  const body = JSON.stringify({
    vocabulary: vocabulary
      .map((v) => ({ id: v.id, ...v.data }))
      .sort((a, b) => a.level.localeCompare(b.level) || a.order - b.order),
    quizzes: quizzes.map((q) => ({ id: q.id, ...q.data })),
  });

  return new Response(body, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
