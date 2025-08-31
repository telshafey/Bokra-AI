
import { GoogleGenAI, Type } from "@google/genai";
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
        Analyze the following anonymous employee data and return your prediction in the specified JSON format.
        
        Data:
        ${JSON.stringify(employeeData, null, 2)}
        
        Consider factors like low satisfaction, low performance, long time without promotion, and salary being below market average as indicators of high risk. High performance coupled with low satisfaction and below-market salary is a very high risk factor. Long tenure with consistent promotions and good scores is low risk.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        riskLevel: { 
                            type: Type.STRING,
                            enum: ['Low', 'Medium', 'High'],
                            description: "The predicted turnover risk level."
                        },
                        riskScore: {
                            type: Type.NUMBER,
                            description: "A numerical score from 0 to 100 representing the risk."
                        },
                        keyFactors: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of the top 3-4 key factors influencing the prediction."
                        }
                    },
                    required: ["riskLevel", "riskScore", "keyFactors"]
                }
            }
        });
        
        const jsonString = response.text;
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