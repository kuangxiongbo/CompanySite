import { GoogleGenAI } from "@google/genai";
import { productsData } from '../data/products';
import { solutionCategories } from '../data/solutions';

const buildContext = () => {
  const products = productsData.map(p => `- ${p.name}: ${p.description}`).join('\n');
  let solutions = '';
  solutionCategories.forEach(c => {
    solutions += `\n【${c.title}】:\n`;
    solutions += c.solutions.map(s => `- ${s.title}: ${s.summary}`).join('\n');
  });
  return `\n\n--- 网站内容参考 ---\n产品列表:\n${products}\n\n解决方案列表:\n${solutions}`;
};

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  prompt: string,
  language: 'zh' | 'en' = 'zh'
): Promise<string> => {
  const client = getAI();
  if (!client) {
    return language === 'zh' ? "未配置 API Key。请检查您的环境设置。" : "API Key not configured. Please check environment settings.";
  }

  const systemInstructionZh = `你是 OLYM（奥联）的 AI 助手，这是一家提供全栈国密安全产品和解决方案的企业。
你的语气应该是专业、创新且乐于助人的。
你需要帮助用户了解 OLYM 的服务，主要包括政务安全、运营商安全、企业安全、数据安全、密码基础设施等。
请保持回答专注于业务场景。遇到具体产品或解决方案时，请参考以下真实详细的网站内容进行综合回答：
${buildContext()}`;

  const systemInstructionEn = `You are the AI Assistant for OLYM, a provider of full-stack national cryptographic security products and solutions.
Your tone should be professional, innovative, and helpful. 
You help users understand OLYM's services which include government security, operator security, enterprise security, data security, and cryptographic infrastructure.
Keep answers concise and business-focused. Use the following detailed website content as context for your answers:
${buildContext()}`;

  try {
    const chat = client.chats.create({
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