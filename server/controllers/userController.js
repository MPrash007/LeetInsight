import NodeCache from 'node-cache';
import {
    fetchUserProfile,
    fetchUserProblems,
    fetchContestHistory,
    fetchSubmissionCalendar,
    fetchUserTagStats,
} from '../services/leetcodeService.js';

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

        const submissionCalendar = calendar?.calendarData || {};
        const streak = calendar?.streak || 0;

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
            submissionCalendar,
            streak,
        };

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
