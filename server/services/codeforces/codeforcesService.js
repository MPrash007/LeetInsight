import { parseCodeforcesUserData } from './parser.js';

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

    return parseCodeforcesUserData(profile, contestHistory, submissions);
}
