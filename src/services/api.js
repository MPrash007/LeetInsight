import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    timeout: 15000,
});

export async function fetchUser(username) {
    const { data } = await API.get(`/user/${username}`);
    return data;
}

export default API;
