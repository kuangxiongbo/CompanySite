import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResponse = async (
  history: { role: string; parts: { text: string }[] }[], 
  prompt: string,
  language: 'zh' | 'en' = 'zh'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return language === 'zh' ? "未配置 API Key。请检查您的环境设置。" : "API Key not configured. Please check environment settings.";
  }

  const systemInstructionZh = `你是 OLYM（奥联）的 AI 助手，这是一家全球领先的企业数字解决方案提供商。
        你的语气应该是专业、创新且乐于助人的。
        你需要帮助用户了解 OLYM 的服务，主要包括：
        1. 云基础设施与安全（参考 Palo Alto Networks 的优势）。
        2. AI 驱动的分析。
        3. 企业咨询服务。
        请保持回答简洁并专注于业务场景，使用中文回答。`;

  const systemInstructionEn = `You are the AI Assistant for OLYM (Olympus Intelligent Cloud), a global leader in enterprise digital solutions.
        Your tone should be professional, innovative, and helpful. 
        You help users understand OLYM's services which include:
        1. Cloud Infrastructure & Security (modeled after Palo Alto Networks' strength).
        2. AI-Driven Analytics.
        3. Enterprise Consulting.
        Keep answers concise and business-focused. Use English.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: language === 'zh' ? systemInstructionZh : systemInstructionEn
      },
      history: history
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || (language === 'zh' ? "抱歉，我现在无法生成回复。" : "I apologize, I cannot generate a response right now.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'zh' ? "目前访问量较大，请稍后再试。" : "High traffic currently, please try again later.";
  }
};