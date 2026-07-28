import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
    baseURL: API_BASE_URL,
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
