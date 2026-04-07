import {
    fetchUserProfile,
    fetchUserProblems,
    fetchContestHistory,
    fetchSubmissionCalendar,
    fetchUserTagStats,
} from './_lib/leetcodeService.js';

// Simple in-memory cache (resets on cold start)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username } = req.query;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Check cache
    const cached = cache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
    }

    try {
        // Run requests sequentially to avoid triggering LeetCode's strict rate limits / Cloudflare blocks on Vercel Datacenter IPs
        const profile = await fetchUserProfile(username);
        if (!profile) {
            return res.status(404).json({ error: `User "${username}" not found` });
        }

        const problems = await fetchUserProblems(username);
        const contest = await fetchContestHistory(username);
        const calendar = await fetchSubmissionCalendar(username);
        const tags = await fetchUserTagStats(username);

        const totalSubmissions = profile.submitStatsGlobal?.acSubmissionNum || [];
        const totalSolved = totalSubmissions.find(s => s.difficulty === 'All')?.count || 0;
        const easySolved = totalSubmissions.find(s => s.difficulty === 'Easy')?.count || 0;
        const mediumSolved = totalSubmissions.find(s => s.difficulty === 'Medium')?.count || 0;
        const hardSolved = totalSubmissions.find(s => s.difficulty === 'Hard')?.count || 0;

        const allProblems = problems?.allQuestionsCount || [];
        const totalEasy = allProblems.find(p => p.difficulty === 'Easy')?.count || 0;
        const totalMedium = allProblems.find(p => p.difficulty === 'Medium')?.count || 0;
        const totalHard = allProblems.find(p => p.difficulty === 'Hard')?.count || 0;
        const totalAll = allProblems.find(p => p.difficulty === 'All')?.count || 0;

        const totalAccepted = totalSubmissions.find(s => s.difficulty === 'All')?.submissions || 0;
        const totalSubmissionCount = profile.submitStatsGlobal?.totalSubmissionNum?.find(s => s.difficulty === 'All')?.submissions || 0;
        const acceptanceRate = totalSubmissionCount > 0
            ? ((totalAccepted / totalSubmissionCount) * 100).toFixed(1)
            : '0.0';

        const contestData = contest || {};
        const contestHistory = contestData.contestHistory || [];
        const attendedContests = contestHistory.filter(c => c.attended);

        const topicStats = (tags || [])
            .map(t => ({ name: t.tagName, count: t.problemsSolved }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        const calendarKeys = Object.keys(calendar || {});
        let streak = 0;
        if (calendarKeys.length > 0) {
            const timestamps = calendarKeys.map(Number);
            const activeDays = new Set(
                timestamps.map(ts => {
                    const d = new Date(ts * 1000);
                    return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
                })
            );

            const today = new Date();
            let current = new Date(today);
            let dateStr = `${current.getUTCFullYear()}-${current.getUTCMonth()}-${current.getUTCDate()}`;
            
            if (!activeDays.has(dateStr)) {
                current.setUTCDate(current.getUTCDate() - 1);
                dateStr = `${current.getUTCFullYear()}-${current.getUTCMonth()}-${current.getUTCDate()}`;
            }

            while (activeDays.has(dateStr)) {
                streak++;
                current.setUTCDate(current.getUTCDate() - 1);
                dateStr = `${current.getUTCFullYear()}-${current.getUTCMonth()}-${current.getUTCDate()}`;
            }
        }

        const result = {
            username: profile.username,
            realName: profile.profile?.realName || '',
            avatar: profile.profile?.userAvatar || '',
            ranking: profile.profile?.ranking || 0,
            reputation: profile.profile?.reputation || 0,
            contributionPoints: profile.contributions?.points || 0,
            badges: profile.badges || [],
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            totalEasy,
            totalMedium,
            totalHard,
            totalAll,
            acceptanceRate: parseFloat(acceptanceRate),
            contestRating: Math.round(contestData.contestRating || 0),
            contestGlobalRanking: contestData.contestGlobalRanking || 0,
            contestTopPercentage: contestData.contestTopPercentage
                ? parseFloat(contestData.contestTopPercentage).toFixed(1)
                : null,
            contestAttended: attendedContests.length,
            contestHistory: attendedContests.map(c => ({
                title: c.contest?.title || '',
                rating: Math.round(c.rating || 0),
                ranking: c.ranking || 0,
                timestamp: c.contest?.startTime || 0,
            })),
            topics: topicStats,
            submissionCalendar: calendar || {},
            streak,
        };

        cache.set(username, { data: result, timestamp: Date.now() });
        res.json(result);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        if (err.message.includes('not found') || err.message.includes('does not exist')) {
            return res.status(404).json({ error: `User "${username}" not found` });
        }
        res.status(500).json({ error: `LeetCode API Error: ${err.message}` });
    }
}
