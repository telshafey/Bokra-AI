
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chat: Chat | null = null;

const getChatInstance = (): Chat => {
  if (!chat) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `
        أنت مساعد ذكاء اصطناعي متخصص في الموارد البشرية لشركة "Bokra HRMS".
        مهمتك هي الإجابة على أسئلة الموظفين المتعلقة بالموارد البشرية بأسلوب احترافي وودود باللغة العربية.
        يمكنك الإجابة على أسئلة حول:
        - سياسات الإجازات (السنوية، المرضية، إلخ).
        - تفاصيل كشف الراتب.
        - إجراءات طلب الشهادات (مثل شهادة الراتب).
        - كيفية تحديث المعلومات الشخصية.
        إذا سُئلت عن شيء خارج نطاق الموارد البشرية، أجب بلطف أنك متخصص في هذا المجال فقط.
        حافظ على إجاباتك موجزة ومفيدة.
        `,
      },
    });
  }
  return chat;
};


export const sendMessageToAI = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
  try {
    const chatInstance = getChatInstance();
    const response = await chatInstance.sendMessageStream({ message });
    return response;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};

export const generateContractWithAI = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fullPrompt = `
      You are an expert legal assistant specializing in Egyptian Labor Law. 
      Your task is to generate a formal employment contract based on the key points provided by the user.
      Use the specific details from the user's points (like names, salaries, dates) to fill out the contract.
      The contract must be in Arabic and adhere to the standards and regulations of Egyptian law.
      Include standard clauses for probation period, duties, confidentiality, and termination.
      The final output should be a complete, ready-to-use contract based on the provided information.

      User's key points: "${prompt}"

      Generate the full contract text now.
  `;

  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
      });

      return response.text.trim();
  } catch (error) {
      console.error("Error generating contract with Gemini:", error);
      return "عذرًا، حدث خطأ أثناء توليد مسودة العقد. يرجى المحاولة مرة أخرى.";
  }
};