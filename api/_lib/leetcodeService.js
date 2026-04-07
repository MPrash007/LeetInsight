const LEETCODE_API = 'https://leetcode.com/graphql';

const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
};

async function graphqlRequest(query, variables = {}) {
    const res = await fetch(LEETCODE_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`LeetCode API returned ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(json.errors[0]?.message || 'GraphQL error');
    }
    return json.data;
}

export async function fetchUserProfile(username) {
    const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          userAvatar
          realName
          ranking
          reputation
        }
        badges {
          name
          icon
        }
        contributions {
          points
        }

        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { username });
    return data?.matchedUser || null;
}

export async function fetchUserProblems(username) {
    const query = `
    query getUserProblems($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { username });
    return data;
}

export async function fetchContestHistory(username) {
    const query = `
    query getUserContestRanking($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { username });
    return {
        contestRating: data?.userContestRanking?.rating || 0,
        contestGlobalRanking: data?.userContestRanking?.globalRanking || 0,
        contestTopPercentage: data?.userContestRanking?.topPercentage || null,
        contestAttended: data?.userContestRanking?.attendedContestsCount || 0,
        contestHistory: data?.userContestRankingHistory || [],
    };
}

export async function fetchSubmissionCalendar(username) {
    const query = `
    query getUserSubmissionCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          streak
          submissionCalendar
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { username });
    const userCalendar = data?.matchedUser?.userCalendar;
    if (!userCalendar) return { streak: 0, calendarData: {} };

    try {
        return {
            streak: userCalendar.streak || 0,
            calendarData: JSON.parse(userCalendar.submissionCalendar || '{}')
        };
    } catch {
        return { streak: 0, calendarData: {} };
    }
}

export async function fetchUserTagStats(username) {
    const query = `
    query getUserTagStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { username });
    const tagCounts = data?.matchedUser?.tagProblemCounts;
    if (!tagCounts) return [];

    const all = [
        ...(tagCounts.fundamental || []),
        ...(tagCounts.intermediate || []),
        ...(tagCounts.advanced || []),
    ];

    const map = new Map();
    for (const t of all) {
        const existing = map.get(t.tagSlug);
        if (!existing || t.problemsSolved > existing.problemsSolved) {
            map.set(t.tagSlug, t);
        }
    }

    return Array.from(map.values());
}
