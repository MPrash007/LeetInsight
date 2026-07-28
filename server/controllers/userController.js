import NodeCache from 'node-cache';
import {
    fetchUserProfile,
    fetchUserProblems,
    fetchContestHistory,
    fetchSubmissionCalendar,
    fetchUserTagStats,
} from '../services/leetcode/leetcodeService.js';
import { parseLeetCodeUserData } from '../services/leetcode/parser.js';

const cache = new NodeCache({ stdTTL: 300 }); // 5 min

export async function getUserData(req, res) {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const cached = cache.get(username);
    if (cached) {
        return res.json(cached);
    }

    try {
        const [profile, problems, contest, calendar, tags] = await Promise.all([
            fetchUserProfile(username),
            fetchUserProblems(username),
            fetchContestHistory(username),
            fetchSubmissionCalendar(username),
            fetchUserTagStats(username),
        ]);

        if (!profile) {
            return res.status(404).json({ error: `User "${username}" not found` });
        }

        const result = parseLeetCodeUserData(profile, problems, contest, calendar, tags);

        cache.set(username, result);
        res.json(result);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        if (err.message.includes('not found') || err.message.includes('does not exist')) {
            return res.status(404).json({ error: `User "${username}" not found` });
        }
        res.status(500).json({ error: 'Failed to fetch LeetCode data. Please try again later.' });
    }
}
