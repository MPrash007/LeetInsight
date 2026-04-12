export async function fetchCodeforcesData(username) {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${username}`),
        fetch(`https://codeforces.com/api/user.rating?handle=${username}`),
        fetch(`https://codeforces.com/api/user.status?handle=${username}`)
    ]);

    if (!infoRes.ok) {
        if (infoRes.status === 400) throw new Error(`User "${username}" not found`);
        throw new Error('Failed to fetch Codeforces user info');
    }

    const infoData = await infoRes.json();
    if (infoData.status !== 'OK') throw new Error(infoData.comment || `User "${username}" not found`);

    const profile = infoData.result[0];

    let contestHistory = [];
    if (ratingRes.ok) {
        const rData = await ratingRes.json();
        if (rData.status === 'OK') {
            contestHistory = rData.result;
        }
    }

    let submissions = [];
    if (statusRes.ok) {
        const sData = await statusRes.json();
        if (sData.status === 'OK') {
            submissions = sData.result;
        }
    }

    const solvedProblems = new Map();
    const allAcceptedSubmissions = [];
    submissions.forEach(sub => {
        if (sub.verdict === 'OK') {
            const probId = `${sub.problem.contestId}-${sub.problem.index}`;
            allAcceptedSubmissions.push(sub);
            if (!solvedProblems.has(probId)) {
                solvedProblems.set(probId, sub.problem);
            }
        }
    });

    const totalSolved = solvedProblems.size;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    
    const tagCounts = new Map();

    Array.from(solvedProblems.values()).forEach(p => {
        if (p.rating) {
            if (p.rating < 1400) easySolved++;
            else if (p.rating < 2000) mediumSolved++;
            else hardSolved++;
        } else {
            mediumSolved++;
        }

        if (p.tags) {
            p.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        }
    });

    const topicStats = Array.from(tagCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    const calendarData = {};
    allAcceptedSubmissions.forEach(sub => {
        const date = new Date(sub.creationTimeSeconds * 1000);
        date.setUTCHours(0, 0, 0, 0);
        const dayStamp = Math.floor(date.getTime() / 1000).toString();
        calendarData[dayStamp] = (calendarData[dayStamp] || 0) + 1;
    });

    let streak = 0;
    const sortedDays = Object.keys(calendarData).map(Number).sort((a, b) => b - a);
    if (sortedDays.length > 0) {
        const today = new Date();
        today.setUTCHours(0,0,0,0);
        let currentDay = Math.floor(today.getTime() / 1000);
        let yesterday = currentDay - 86400;

        let streakStartIdx = 0;
        if (sortedDays[0] === currentDay) {
             // starting today
        } else if (sortedDays[0] === yesterday) {
             // starting yesterday
             currentDay = yesterday;
        } else {
            streakStartIdx = -1;
        }

        if (streakStartIdx === 0) {
            streak = 1;
            let checkDay = currentDay;
            for (let i = 1; i < sortedDays.length; i++) {
                if (sortedDays[i] === checkDay - 86400) {
                    streak++;
                    checkDay -= 86400;
                } else {
                    break;
                }
            }
        }
    }

    const mappedContests = contestHistory.map(c => ({
        title: c.contestName,
        rating: c.newRating,
        ranking: c.rank,
        timestamp: c.ratingUpdateTimeSeconds
    }));

    return {
        username: profile.handle,
        realName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        avatar: profile.titlePhoto || profile.avatar || '',
        ranking: profile.maxRating || 0,
        reputation: profile.contribution || 0,
        contributionPoints: profile.contribution || 0,
        badges: profile.rank ? [{ name: profile.rank, icon: '' }] : [],
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalEasy: null,
        totalMedium: null,
        totalHard: null,
        totalAll: null,
        acceptanceRate: submissions.length > 0 ? parseFloat((allAcceptedSubmissions.length / submissions.length * 100).toFixed(1)) : 0.0,
        contestRating: profile.rating || 0,
        contestGlobalRanking: 0,
        contestTopPercentage: null,
        contestAttended: contestHistory.length,
        contestHistory: mappedContests,
        topics: topicStats,
        submissionCalendar: calendarData,
        streak
    };
}
