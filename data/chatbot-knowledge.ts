export interface ChatbotEntry {
  keywords: string[];
  response: string;
  topic: string;
}

export const chatbotKnowledge: ChatbotEntry[] = [
  {
    topic: "intro",
    keywords: ["hello", "hi", "hey", "who are you", "what is this", "bot"],
    response: "Hi! I'm Axel's bot. I can answer questions about his projects, tech stack, education, and how to contact him. What would you like to know?"
  },
  {
    topic: "projects",
    keywords: ["project", "projects", "work", "portfolio", "built", "made", "reson8", "scsaga", "water station", "atelier", "quorin"],
    response: "Axel has built several notable projects including Reson8 (a 4-tier podcast platform), SCSAGA (a campus attendance analytics system with GCP), and Atelier Carven (a full-stack e-commerce app). You can check them out in the Projects section above!"
  },
  {
    topic: "stack",
    keywords: ["stack", "tech", "skills", "technologies", "frameworks", "languages", "react", "nextjs", "next", "supabase", "vue", "php"],
    response: "Axel specializes in full-stack web and mobile development. His core stack includes React, Next.js, React Native/Expo, and Supabase. He also has experience with Vue, PHP, Python (Flask), and GCP (BigQuery). Look at the Stack section for a full list!"
  },
  {
    topic: "education",
    keywords: ["education", "school", "university", "college", "degree", "bsit", "student"],
    response: "Axel is currently a 4th-year BSIT (Bachelor of Science in Information Technology) student at Wesleyan University - Philippines, Cabanatuan City Campus."
  },
  {
    topic: "experience",
    keywords: ["experience", "job", "work", "internship", "freelance", "role"],
    response: "Axel is an active freelance web developer. He has worked as a Full-Stack Developer, Backend & Data Engineer, and Frontend Lead across multiple freelance and academic projects. His main focus right now is React and mobile development, plus exploring AI integrations."
  },
  {
    topic: "contact",
    keywords: ["contact", "email", "hire", "reach", "message", "social", "github"],
    response: "You can reach Axel by sending an email to dev.akioxz@gmail.com, or by using the contact form at the bottom of the page. You can also find him on GitHub @akioxz!"
  },
  {
    topic: "ai",
    keywords: ["ai", "generative", "llm", "chatgpt", "gemini", "openai"],
    response: "Axel is actively diving into AI integrations and generative AI, exploring how LLMs can be applied to real-world software development!"
  }
];

export const fallbackResponse = "I'm a simple bot and I don't have info on that yet! Try asking about Axel's projects, tech stack, or how to reach him.";

export const suggestedPrompts = [
  "What projects have you built?",
  "What is your tech stack?",
  "How can I contact you?"
];
