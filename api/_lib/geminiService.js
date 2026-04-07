import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateDeepInsights(userData) {
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

    const prompt = `
You are an expert competitive programming coach and LeetCode mentor. 
Review the following user statistics for "${summary.username}":
- Total Solved: ${summary.totalSolved} (Easy: ${summary.difficultyBreakdown.easy}, Medium: ${summary.difficultyBreakdown.medium}, Hard: ${summary.difficultyBreakdown.hard})
- Contest Rating: ${summary.rating}
- Top tags/strengths: ${summary.strengths.map(s => s.name).join(', ')}
- Last 3 contest ratings: ${summary.recentContests.join(', ')}

Please provide a highly personalized, encouraging, and actionable 3-paragraph analysis. 
Format your response using Markdown:
1. A brief overview of their current skill level and momentum.
2. What specific topics or difficulty levels they should focus on next to increase their performance/rating.
3. A specific, actionable tip for their daily progression.

Keep the tone motivating and professional. Speak directly to the user (e.g. "You have built a solid foundation..."). Use bolding for emphasis where appropriate.
`;

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
