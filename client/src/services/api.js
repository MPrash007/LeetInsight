import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    timeout: 15000,
});

export async function fetchUser(platform = 'leetcode', username) {
    const endpoint = platform === 'codeforces' ? `/codeforces/${username}` : `/user/${username}`;
    const { data } = await API.get(endpoint);
    return data;
}

export async function generateInsights(userData, platform = 'leetcode') {
    const { data } = await API.post('/insights', { ...userData, platform });
    return data;
}

export default API;
