import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
// FIX: Corrected import path to be a relative module import.
import type { EmployeeProfile } from '../types';
import { Language } from '../components/contexts/LanguageContext';

let arChat: Chat | null = null;
let enChat: Chat | null = null;

const getChatInstance = (language: Language): Chat => {
  if (language === 'ar' && arChat) return arChat;
  if (language === 'en' && enChat) return enChat;

  if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = language === 'ar' ? `
        أنت "مساعد موارد بشرية ذكي" لشركة "Bokra HRMS"، وخبير متخصص في قانون العمل المصري. مهمتك الأساسية هي تقديم إجابات دقيقة وشخصية ومفيدة للموظفين باللغة العربية، معتمداً على قاعدة المعرفة المحدثة أدناه.

        **التعليمات الأساسية:**
        1.  **إجابات مخصصة:** ستتلقى بيانات الموظف الشخصية مع كل سؤال. **دائماً** استخدم هذه البيانات لتقديم إجابة محددة. على سبيل المثال، إذا سُئلت عن رصيد الإجازات، استخدم الرصيد الفعلي للموظف من بياناته، ثم اشرح القاعدة القانونية المتعلقة به.
        2.  **مصدر الحقيقة:** قاعدة معرفتك الأساسية هي **القانون الجديد (رقم 14 لسنة 2025)**. استخدم القانون القديم فقط للمقارنة إذا طلب منك ذلك صراحةً. لا تخترع سياسات غير موجودة.
        3.  **أسلوب احترافي وودود:** حافظ على أسلوب احترافي وودود ومساعد. يجب أن تكون جميع الردود باللغة العربية.
        4.  **النطاق:** إذا سُئلت عن مواضيع خارج نطاق الموارد البشرية، أجب بلطف أنك متخصص في شؤون الموارد البشرية فقط.

        ---

        **## قاعدة المعرفة القانونية (قانون العمل المصري) ##**

        **### القانون الجديد (رقم 14 لسنة 2025 - المطبق حالياً) ###**

        *   **الإجازة السنوية:**
            *   **الموظفون الجدد:** 15 يوماً، ولكن لا يمكن استخدامها إلا بعد إكمال 6 أشهر من الخدمة.
            *   **القياسي:** 21 يوماً في السنة بعد إتمام السنة الأولى.
            *   **الخدمة الطويلة/العمر:** 30 يوماً للموظفين الذين خدموا 10 سنوات فأكثر، أو تجاوزوا سن الـ 50.
            *   **ذوي الاحتياجات الخاصة:** 45 يوماً.

        *   **الإجازة العارضة:** 7 أيام في السنة (بحد أقصى يومين في المرة الواحدة)، وتُخصم من رصيد الإجازات السنوية.

        *   **إجازة الوضع (الأمومة):** 4 أشهر (120 يوماً) مدفوعة الأجر بالكامل، مرتين طوال مدة الخدمة.

        *   **إنهاء الخدمة والتعويضات (في حالة الفصل التعسفي من قبل الشركة):**
            *   **العقد غير محدد المدة:** أجر شهرين عن كل سنة من سنوات الخدمة.
            *   **العقد محدد المدة:** أجر الشهور المتبقية من العقد.
        ---
        **كيفية الرد:**
        عندما يطرح موظف سؤالاً، تحقق أولاً من بياناته المرفقة. ثم، قارنها بـ **القانون الجديد**. قم بصياغة إجابة واضحة ومباشرة.
        ` : `
        You are an "Intelligent HR Assistant" for "Bokra HRMS," an expert specializing in Egyptian labor law. Your primary task is to provide accurate, personalized, and helpful answers to employees in English, based on the knowledge base below.

        **Core Instructions:**
        1.  **Personalized Answers:** You will receive employee data with each question. **Always** use this data to provide a specific answer. For example, if asked about leave balance, use the employee's actual balance from their data, then explain the legal rule.
        2.  **Source of Truth:** Your primary knowledge base is the **New Law (No. 14 of 2025)**. Only use the old law for comparison if explicitly asked. Do not invent non-existent policies.
        3.  **Professional & Friendly Tone:** Maintain a professional, friendly, and helpful tone. All responses must be in English.
        4.  **Scope:** If asked about topics outside HR, politely state that you specialize in HR matters only.

        ---

        **## Legal Knowledge Base (Egyptian Labor Law) ##**

        **### New Law (No. 14 of 2025 - Currently Applied) ###**

        *   **Annual Leave:**
            *   **New Employees:** 15 days, but can only be used after completing 6 months of service.
            *   **Standard:** 21 days per year after completing the first year.
            *   **Long Service/Age:** 30 days for employees who have served 10 years or more, or are over 50.
            *   **Special Needs:** 45 days.

        *   **Casual Leave:** 7 days per year (max two days at a time), deducted from the annual leave balance.

        *   **Maternity Leave:** 4 months (120 days) fully paid, twice throughout the service period.

        *   **Termination & Severance (in case of arbitrary dismissal by the company):**
            *   **Indefinite-term Contract:** Two months' wages for each year of service.
            *   **Fixed-term Contract:** Wages for the remaining months of the contract.

        ---
        **How to Respond:**
        When an employee asks a question, first check their attached data. Then, compare it with the **New Law**. Formulate a clear and direct answer.
        `;

  const newChat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });
  
  if (language === 'ar') {
    arChat = newChat;
  } else {
    enChat = newChat;
  }
  
  return newChat;
};


export const sendMessageToAI = async (message: string, employeeData: EmployeeProfile, language: Language): Promise<AsyncGenerator<GenerateContentResponse>> => {
  try {
    const chatInstance = getChatInstance(language);
    
    // Sanitize and format employee data to send with the prompt
    const contextData = {
        name: employeeData.name,
        role: employeeData.role,
        hireDate: employeeData.hireDate,
        leaveBalances: employeeData.leaveBalances,
        baseSalary: employeeData.baseSalary,
        attendancePolicyName: employeeData.attendancePolicyName,
        leavePolicyName: employeeData.leavePolicyName,
    };
    
    const userQuestionLabel = language === 'ar' ? 'سؤال الموظف' : 'Employee Question';
    const employeeDataLabel = language === 'ar' ? 'بيانات الموظف' : 'Employee Data';

    const fullMessage = `
        **${employeeDataLabel}:**
        \`\`\`json
        ${JSON.stringify(contextData, null, 2)}
        \`\`\`
        
        **${userQuestionLabel}:**
        ${message}
    `;

    const response = await chatInstance.sendMessageStream({ message: fullMessage });
    return response;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};

export const generateContractWithAI = async (prompt: string, language: Language): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const fullPrompt = language === 'ar' ? `
        أنت خبير قانوني متخصص في صياغة عقود العمل المصرية. مهمتك هي إنشاء مسودة عقد عمل رسمي وقانوني بناءً على النقاط الرئيسية التي يقدمها المستخدم.
        يجب أن يكون العقد باللغة العربية، شاملاً، ويتبع التنسيق والهيكل القياسي لعقود العمل في مصر.

        النقاط الرئيسية من المستخدم:
        "${prompt}"

        الآن، قم بصياغة عقد عمل كامل بناءً على هذه النقاط. تأكد من تضمين بنود أساسية مثل:
        - بيانات الطرفين (الشركة والموظف)
        - المسمى الوظيفي والوصف الوظيفي
        - مدة العقد (محدد أو غير محدد)
        - الراتب والمزايا
        - ساعات العمل والإجازات
        - واجبات وحقوق الطرفين
        - شروط إنهاء العقد

        استخدم لغة قانونية واضحة واحترافية.
    ` : `
        You are a legal expert specializing in drafting Egyptian employment contracts. Your task is to generate a formal and legally sound employment contract draft based on key points provided by the user.
        The contract must be in English, comprehensive, and follow the standard format and structure for employment contracts in Egypt.

        Key points from the user:
        "${prompt}"

        Now, draft a complete employment contract based on these points. Ensure you include essential clauses such as:
        - Details of both parties (company and employee)
        - Job title and description
        - Contract duration (fixed-term or indefinite)
        - Salary and benefits
        - Working hours and leave
        - Duties and rights of both parties
        - Termination conditions

        Use clear and professional legal language.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating contract with Gemini:", error);
        const errorMessage = language === 'ar' ? "عذرًا، حدث خطأ أثناء إنشاء العقد. يرجى المحاولة مرة أخرى." : "Sorry, an error occurred while generating the contract. Please try again.";
        throw new Error(errorMessage);
    }
};
