import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildInsightPrompt } from './prompts.js';

export async function generateDeepInsights(userData, platform = 'leetcode') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare data summary to send to the model to reduce token usage
    const summary = {
        username: userData.username,
        rating: userData.contestRating,
        totalSolved: userData.totalSolved,
        difficultyBreakdown: {
            easy: userData.easySolved,
            medium: userData.mediumSolved,
            hard: userData.hardSolved
        },
        strengths: userData.topics.slice(0, 5),
        recentContests: userData.contestHistory.slice(-3).map(c => c.rating)
    };

    const platformName = platform === 'codeforces' ? 'Codeforces' : 'LeetCode';
    const prompt = buildInsightPrompt(summary, platformName);

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            if (error.message && error.message.includes('503') && attempt < MAX_RETRIES - 1) {
                attempt++;
                // Wait 1.5s, 3s, 4.5s
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
                continue;
            }
            throw error;
        }
    }
}
