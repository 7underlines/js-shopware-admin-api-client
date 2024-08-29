import RefreshTokenHelper from './utils/refresh-token.helper.js';
import axios from 'axios';

export function createClient(url, token, id, secret) {
    const client = axios.create({
        baseURL: `${url}/api`
    })

    client.defaultUrl = url;
    client.token = token;
    client.id = id;
    client.secret = secret;

    client.defaults.headers.Authorization = `Bearer ${token.access_token}`;

    refreshTokenInterceptor(client);

    return client;
}

function refreshTokenInterceptor(client) {
    const tokenHandler = new RefreshTokenHelper(client);

    client.interceptors.request.use((config) => {
        const resource = config.url.replace(config.baseURL, '');
        if (tokenHandler.allowlist.includes(resource)) {
            return config;
        }
        // use -600000 to test token refresh
        if (!tokenHandler.isRefreshing && Date.now() > client.token.valid_until - 120000) {
            tokenHandler.fireRefreshTokenRequest().catch((err) => {
                return Promise.reject(err);
            });
        }
        return config;
    });
}
