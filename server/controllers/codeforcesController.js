import NodeCache from 'node-cache';
import { fetchCodeforcesData } from '../services/codeforcesService.js';

const cache = new NodeCache({ stdTTL: 300 }); // 5 min

export async function getCodeforcesData(req, res) {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const cached = cache.get(username);
    if (cached) {
        return res.json(cached);
    }

    try {
        const result = await fetchCodeforcesData(username);
        cache.set(username, result);
        res.json(result);
    } catch (err) {
        console.error('Error fetching Codeforces data:', err.message);
        if (err.message.includes('not found') || err.message.includes('does not exist')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to fetch Codeforces data. Please try again later.' });
    }
}
