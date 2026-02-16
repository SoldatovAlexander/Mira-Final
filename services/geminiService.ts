import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const streamChatResponse = async (
  history: Message[],
  systemPrompt: string,
  baseKnowledge: string,
  onChunk: (text: string) => void
) => {
  const ai = getAi();
  const lastUserMessage = history[history.length - 1];
  
  const fullSystemInstruction = `${systemPrompt}\n\nKNOWLEDGE BASE:\n${baseKnowledge}`;

  // Filter history to only recent messages to save context, formatted for Gemini
  // In a real app we'd map roles properly. Here we simplify.
  // We actually need to start a chat session or just generate content.
  // For dual stream, generateContentStream with history as context text is easier 
  // than managing two ChatSession states.
  
  const prompt = `
    History:
    ${history.slice(0, -1).map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}
    
    USER: ${lastUserMessage.text}
    AI:
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: fullSystemInstruction,
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Chat Stream Error:", error);
    onChunk("\n[Connection Error: Please try again]");
  }
};

export const streamHtmlResponse = async (
  userMessage: string,
  systemPrompt: string,
  baseKnowledge: string,
  onChunk: (html: string) => void
) => {
  const ai = getAi();
  
  const fullSystemInstruction = `${systemPrompt}\n\nKNOWLEDGE BASE:\n${baseKnowledge}`;

  const prompt = `
    User Request: "${userMessage}"
    
    Generate the HTML content for the right-side panel based on this request. 
    If the request implies showing data, UI forms, dashboards, or information, generate the HTML.
    If the request does not require a UI change, return an empty string.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: fullSystemInstruction,
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("HTML Stream Error:", error);
  }
};
