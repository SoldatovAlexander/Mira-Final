import { PromptData } from '../types';

const FALLBACK_SYSTEM_PROMPT = `
# CHAT
You are Mira, an AI Recruiter. You are professional, friendly, and efficient.
You help users find candidates, screen resumes, and automate hiring.
Always answer in a helpful, conversational tone.
Use Markdown for formatting.

# HTML
You are a UI Generator. You generate HTML content for the right-side panel of the application.
Output ONLY raw HTML. Do not wrap in markdown code blocks.
Use Tailwind CSS classes for styling.
Backgrounds should be white or transparent with glass effects.
You MAY use <img> tags. Available assets: 'avatar_mira.png', 'hiring_funnel_stats.jpg', 'candidate_card.png', 'job_statistics.png'.
`;

const FALLBACK_BASE = `
Mira is the first AI recruiter in Russia.
It works 24/7, screens thousands of candidates, and increases hiring speed by 5x.
`;

const tryFetch = async (filename: string): Promise<string | null> => {
  const paths = [
    `public/${filename}`,
    `/${filename}`,
    filename,
    `./public/${filename}`
  ];

  for (const path of paths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) { // Basic HTML check
           return text;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
};

export const loadPrompts = async (): Promise<PromptData> => {
  try {
    const [systemPrompt, baseKnowledge] = await Promise.all([
      tryFetch('system_promt.md'),
      tryFetch('base.md')
    ]);

    if (!systemPrompt || !baseKnowledge) {
      console.warn('Failed to fetch prompts from all paths, using fallback');
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        baseKnowledge: FALLBACK_BASE
      };
    }

    return { systemPrompt, baseKnowledge };
  } catch (error) {
    console.warn('Error loading prompts:', error);
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      baseKnowledge: FALLBACK_BASE
    };
  }
};

export const extractSection = (fullText: string, sectionName: string): string => {
  const parts = fullText.split(/^# /m);
  const found = parts.find(p => p.startsWith(sectionName));
  return found ? found.replace(sectionName, '').trim() : '';
};