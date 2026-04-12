import { fetchCodeforcesData } from './_lib/codeforcesService.js';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username } = req.query;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const cached = cache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
    }

    try {
        const result = await fetchCodeforcesData(username);
        cache.set(username, { data: result, timestamp: Date.now() });
        res.json(result);
    } catch (err) {
        console.error('Error fetching Codeforces data:', err.message);
        if (err.message.includes('not found') || err.message.includes('does not exist')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: `Codeforces API Error: ${err.message}` });
    }
}
