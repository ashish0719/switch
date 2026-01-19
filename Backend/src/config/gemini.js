import { GoogleGenerativeAI } from "@google/generative-ai";


let geminiModel;

export const getGeminiModel = () => {
    if (!geminiModel) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables");
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        geminiModel = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });
    }
    return geminiModel;
};

