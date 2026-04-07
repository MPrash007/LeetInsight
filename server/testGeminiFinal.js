import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load the new .env

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log("No API Key found locally!");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello, are you online?");
        console.log("SUCCESS: " + result.response.text());
    } catch (e) {
        console.log("ERROR: " + e.message);
    }
}
test();
