export default class RefreshTokenHelper {
    constructor(client) {
        this._client = client;
        this._isRefreshing = false;
        this._subscribers = [];
        this._errorSubscribers = [];
        this._allowlist = [
            '/oauth/token'
        ];
    }

    /**
     * Subscribe a new callback to the cache queue
     *
     * @param {Function} [callback = () => {}]
     * @param {Function} [errorCallback = () => {}]
     */
    subscribe(callback = () => {}, errorCallback = () => {}) {
        this._subscribers.push(callback);
        this._errorSubscribers.push(errorCallback);
    }

    /**
     * Event handler which will be fired when the token got refresh. It iterates over the registered
     * subscribers and fires the callbacks with the new token.
     *
     * @param {String} token - Renewed access token
     */
    onRefreshToken(token) {
        token.valid_until = Date.now() + token.expires_in * 1000;
        this._client.token = token;
        this._client.defaults.headers.Authorization = `Bearer ${token.access_token}`;
        this._subscribers = this._subscribers.reduce((accumulator, callback) => {
            callback.call(null, token.access_token);
            return accumulator;
        }, []);
        this._errorSubscribers = [];
    }

    /**
     * Event handler which will be fired when the refresh token couldn't be fetched from the API
     *
     * @param {Error} err
     */
    onRefreshTokenFailed(err) {
        this._errorSubscribers = this._errorSubscribers.reduce((accumulator, callback) => {
            callback.call(null, err);
            return accumulator;
        }, []);
        this._subscribers = [];
    }

    /**
     * Fires the refresh token request and renews the bearer authentication in the login service.
     *
     * @returns {Promise<String>}
     */
    fireRefreshTokenRequest() {
        this.isRefreshing = true;

        // this._client.token.refresh_token could be undefined for client credentials grant type
        if (!this._client.token.refresh_token) {
            return this._client.post(`${this._client.defaultUrl}/api/oauth/token`, {
                client_id: this._client.id,
                client_secret: this._client.secret,
                grant_type: "client_credentials"
            }).then((res) => {
                this.onRefreshToken(res.data); // Runs if the request is successful
            }).finally(() => {
                this.isRefreshing = false; // Always runs, regardless of success or failure
            }).catch((err) => {
                this.onRefreshTokenFailed(); // Runs if there was an error
                return Promise.reject(err); // Propagates the error
            });
        } else {
            return this._client.post(`${this._client.defaultUrl}/api/oauth/token`, {
                grant_type: 'refresh_token',
                client_id: 'administration',
                scopes: 'write',
                refresh_token: this._client.token.refresh_token
            }).then((res) => {
                this.onRefreshToken(res.data); // Runs if the request is successful
            }).finally(() => {
                this.isRefreshing = false; // Always runs, regardless of success or failure
            }).catch((err) => {
                this.onRefreshTokenFailed(); // Runs if there was an error
                return Promise.reject(err); // Propagates the error
            });
        }
    }

    get allowlist() {
        return this._allowlist;
    }

    set allowlist(urls) {
        this._allowlist = urls;
    }

    get isRefreshing() {
        return this._isRefreshing;
    }

    set isRefreshing(value) {
        this._isRefreshing = value;
    }
}
