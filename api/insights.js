import { generateDeepInsights } from './_lib/geminiService.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userData = req.body;
        if (!userData || !userData.username) {
            return res.status(400).json({ error: 'User data is required in the body' });
        }

        const insightMarkdown = await generateDeepInsights(userData, userData.platform);
        res.json({ insight: insightMarkdown });
    } catch (err) {
        console.error('Gemini API Error:', err.message);
        res.status(500).json({ error: err.message || 'Failed to generate insights.' });
    }
}
