import axios from 'axios';
import Api from './api.js';
export {default as Criteria} from './data/criteria.data.js';

export async function createFromPasswordAndLogin(url, username, password) {
    let res;

    try {
        res = await axios.post(`${url}/api/oauth/token`, {
            client_id: "administration",
            grant_type: "password",
            scopes: "write",
            username: username,
            password: password
        });
    } catch(err) {
        if (err.response && err.response.status === 401) {
            throw new Error('Invalid credentials');
        }

        throw err;
    }
    res.data.request_at = Date.now();
    res.data.valid_until = res.data.request_at + res.data.expires_in * 1000 - 50000; // -50000 is a buffer just to be safe
    let api = new Api(url, res.data);
    await api._initialize();

    return api;
};


export async function createFromIntegration(url, id, secret) {
    let res;

    try {
        res = await axios.post(`${url}/api/oauth/token`, {
            client_id: id,
            client_secret: secret,
            grant_type: "client_credentials"
        });
    } catch(err) {
        if (err.response.status === 401) {
            throw new Error('Invalid credentials');
        }

        throw err;
    }

    let api = new Api(url, res.data);
    await api._initialize();

    return api;
}
