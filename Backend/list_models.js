
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available Gemini Models:");
            data.models.forEach(m => {
                if (m.name.toLowerCase().includes("gemini")) {
                    console.log(m.name);
                }
            });
        } else {
            console.log("No models found property in response", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
