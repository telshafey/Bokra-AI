
import { GoogleGenAI } from "@google/genai";
import type { EmployeeProfile, TurnoverAnalysisResult } from '../types';

function getYearsOfService(hireDate: string): number {
    const start = new Date(hireDate);
    const now = new Date();
    const diffInMs = now.getTime() - start.getTime();
    return parseFloat((diffInMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
}

export const getTurnoverPrediction = async (employee: EmployeeProfile): Promise<TurnoverAnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const yearsOfService = getYearsOfService(employee.hireDate);
    const timeSincePromotion = employee.lastPromotionDate 
        ? getYearsOfService(employee.lastPromotionDate)
        : null;

    const employeeData = {
        yearsOfService,
        performanceScore: employee.performanceScore,
        satisfactionSurveyScore: employee.satisfactionSurveyScore,
        timeSinceLastPromotionInYears: timeSincePromotion,
        salaryComparedToMarket: employee.salaryComparedToMarket,
        department: employee.department,
        title: employee.title,
    };

    const prompt = `
        You are an expert HR analyst. Your task is to predict the employee turnover risk based on the provided data.
        Analyze the following anonymous employee data and return your prediction ONLY as a valid JSON object with the following structure: { "riskLevel": "Low" | "Medium" | "High", "riskScore": number, "keyFactors": string[] }. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
        
        Data:
        ${JSON.stringify(employeeData, null, 2)}
        
        Consider factors like low satisfaction, low performance, long time without promotion, and salary being below market average as indicators of high risk. High performance coupled with low satisfaction and below-market salary is a very high risk factor. Long tenure with consistent promotions and good scores is low risk.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as TurnoverAnalysisResult;

    } catch (error) {
        console.error("Error getting turnover prediction from Gemini:", error);
        return {
            riskLevel: 'Unknown',
            riskScore: 0,
            keyFactors: ['Failed to retrieve analysis from AI service.']
        };
    }
};