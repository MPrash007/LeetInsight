import { generateDeepInsights } from '../../api/_lib/geminiService.js';

export const getAiInsights = async (req, res) => {
    try {
        const userData = req.body;
        if (!userData || !userData.username) {
            return res.status(400).json({ error: 'User data is required' });
        }
        const insightMarkdown = await generateDeepInsights(userData, userData.platform);
        res.json({ insight: insightMarkdown });
    } catch (error) {
        console.error('Gemini Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to generate remote insights.' });
    }
};
