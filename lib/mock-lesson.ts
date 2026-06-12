import type { LessonType } from "@/lib/schemas/lesson";

export const MOCK_LESSON: LessonType = {
  category: "GenAI",
  topic: "Attention Is All You Need",
  cards: [
    {
      type: "hook",
      title: "Why do models forget the beginning?",
      body: "When you read a long paragraph, you naturally re-read earlier sentences to stay oriented. Transformers solved this by letting every word look at every other word at once — no sequential bottleneck.",
      emphasis: "every word look at every other word",
      visual: "spark",
    },
    {
      type: "concept",
      title: "Self-attention in plain terms",
      body: "Each token asks a simple question: which other tokens matter most for understanding me right now? It scores them, blends their meaning, and updates its own representation. That's attention — a weighted spotlight, not magic.",
      emphasis: "weighted spotlight, not magic",
      visual: "flowNodes",
    },
    {
      type: "concept",
      title: "Queries, keys, and values",
      body: "Think of a library search. Your query is what you're looking for. Keys are labels on shelves. Values are the books you pull. Attention computes how well each key matches your query, then returns a mix of values.",
      emphasis: "how well each key matches your query",
      visual: "gridReveal",
    },
    {
      type: "example",
      title: "Like a dinner party intro",
      body: "Imagine walking into a party. You scan faces, weigh who seems relevant to you, and tune into those conversations while fading the rest. Self-attention is that social radar — applied billions of times per second.",
      emphasis: "that social radar",
      visual: "orbit",
    },
    {
      type: "takeaway",
      title: "The one-line version",
      body: "Transformers don't read left-to-right like humans — they weigh the whole context at every step. That parallel lookup is why modern AI can handle long, rich inputs without losing the thread.",
      emphasis: "weigh the whole context at every step",
      visual: "spiral",
    },
  ],
  quiz: {
    question: "What does self-attention let each token do?",
    options: [
      "Read tokens strictly in order",
      "Weigh all other tokens for relevance",
      "Store facts permanently in memory",
    ],
    correctIndex: 1,
    explanation:
      "Self-attention scores every other token and blends the most relevant ones into the current representation.",
  },
};
