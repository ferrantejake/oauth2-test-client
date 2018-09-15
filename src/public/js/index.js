// More on this process here: 
// https://auth0.com/docs/api/authentication#implicit-grant


let oauthClient, jwtClient, scopeComponent;

const { pathname, host, protocol } = window.location;
const callback_endpoint = protocol + '//' + host + pathname + 'callback'


// oauthClient = new Vue({
//     el: '#oauth2Client',
//     data: {
//         config: {},
//     },
//     created: function () {
//         let client_id = localStorage.getItem('client_id');
//         let client_secret = localStorage.getItem('client_secret');
//         let auth_endpoint = localStorage.getItem('auth_endpoint');
//         // let token_endpoint = localStorage.getItem('token_endpoint');
//         const { pathname, host, protocol } = window.location;
//         const callback_endpoint = protocol + '//' + host + pathname + 'callback'

//         this.config = {
//             client_id,
//             client_secret,
//             auth_endpoint,
//             // token_endpoint,
//             callback_endpoint
//         }
//     },
//     methods: {
//         clearConfig: function () {
//             this.config = {
//                 callback_endpoint
//             };
//             localStorage.removeItem('client_id');
//             localStorage.removeItem('client_secret');
//             localStorage.removeItem('auth_endpoint');
//             localStorage.removeItem('token_endpoint');
//         },
//         startAuth: function () {
//             try {
//                 const query = Object.keys(this.config).reduce(function (acc, key) {
//                     const val = this.config[key];
//                     if (val === '' || !!val)
//                         throw new Error('missing value for', val)
//                     return acc += '?' + key + '=' + val;

//                     windows.location

//                 }, '?')
//             } catch (e) {
//                 console.log(e);
//                 return;
//             }
//         }
//     },
//     updateConfigItem: function (x, y) {
//         console.log('x', x)
//         console.log('y', y)
//     }
// })

class Mutex {
    constructor(isReady) {
        this.isReady = isReady;
        this.queue = [];
    }

    call(callback) {
        if (callback) {
            this.queue.push(callback);
        }

        if (this.isReady()) {
            console.log('mutex call:ready')
            this.queue.forEach(c => c());
            this.queue = [];
        } else {
            console.log('mutex call: not ready')
        }
    }

    retry() {
        this.call();
    }
}

jwtClient = {
    data: {
        client: '',
        config: {
            response_type: 'token' // get access tokenb
        },
        // inputTimeout: Date,
        // hasDebounced: () => boolean,
        // mutex: Mutex
        // retryCount: number
    },
    created: function () {
        this.inputTimeout = new Date();
        this.hasDebounced = () => this.inputTimeout.getTime() < (new Date().getTime() - 100);
        this.mutex = new Mutex(this.hasDebounced);
        this.retryCount = 0;
    },
    methods: {
        clearTokens: function () {
            const items = [
                `${this.client}_access_token`,
                `${this.client}_expires_in`
            ];

            items.forEach(i => {
                delete this.config[i];
                localStorage.removeItem(i);
                console.log('clearing', i)
            });

            vm.$forceUpdate();
        },
        validateWithDroplit: function () {
            if (!this.config[`${this.client}_jwt_validation_endpoint`]) {
                return alert('validation endpoint required')
            }
            // if (!this.config[`${this.client}_authorization_header`]) {
            //     return alert('authorization required')
            // }

            const options = {
                headers: {
                    // 'Authorization': this.config[`${this.client}_authorization_header`],
                    'Content-Type': 'application/json'
                },
                responseType: 'json'
            }
            const droplitClient = axios.create(options);
            const body = {
                accessToken: this.config[`${this.client}_access_token`],
                idToken: '<anything can go here>',
                ttl: 3600
            };

            droplitClient
                .post(this.config[`${this.client}_jwt_validation_endpoint`], body)
                .then(console.log)
                .catch(console.log)
        },
        onConfigChange: function (e) {
            console.log('mutex', this.mutex);
            INPUT_TIMEOUT = 150;

            if (this.hasDebounced()) {
                console.log('debounced')
                this.mutex.call(findAttrsAndUpdate.bind(this))
                this.delayedUpdated = undefined;
            } else {
                console.log('not debounced')

                if (this.retryCount === 0) {
                    console.log('added to call stack')
                    this.mutex.call(findAttrsAndUpdate.bind(this))
                    this.retryCount++;
                } else {
                    console.log('not added to call stack')
                }

                if (this.delayedUpdated) {
                    clearTimeout(this.delayedUpdated);
                }

                this.delayedUpdated = setTimeout(() => {
                    console.log('calling retry')
                    this.mutex.retry()
                    this.retryCount = 0;
                }, INPUT_TIMEOUT)


            }

            this.inputTimeout = new Date();
            return; // end of function

            function findAttrsAndUpdate() {
                console.log('findAttrsAndUpdate')
                const attrs = e.target.attributes;
                const len = attrs.length;

                const name = attrs.getNamedItem('name').value;
                const value = document.getElementsByName(name)[0].value;

                this.updateConfigItem(name, value)
            }
        },

        updateConfigItem: function (item_name, item_value) {
            console.log('updateConfigItem', item_name, item_value);
            this.config[item_name] = item_value;
            localStorage.setItem(item_name, item_value)
        }
    }
}


auth0Client = new Vue({
    el: '#auth0',
    mixins: [jwtClient],
    data: {
        client: 'auth0',
        config: {}
    },
    created: function () {
        const auth0_domain = localStorage.getItem('auth0_domain');
        const auth0_client_id = localStorage.getItem('auth0_client_id');
        const auth0_audience = localStorage.getItem('auth0_audience');

        this.config.auth0_domain = auth0_domain;
        this.config.auth0_client_id = auth0_client_id;
        this.config.auth0_audience = auth0_audience;

        const auth0_access_token = localStorage.getItem('auth0_access_token');
        const auth0_expires_in = localStorage.getItem('auth0_expires_in');

        this.config.auth0_access_token = auth0_access_token;
        this.config.auth0_expires_in = auth0_expires_in;

        const jwt_validation_endpoint = localStorage.getItem(`${this.client}_jwt_validation_endpoint`);
        this.config[`${this.client}_jwt_validation_endpoint`] = jwt_validation_endpoint;

        // const authorization_header = localStorage.getItem(`${this.client}_authorization_header`);
        // this.config[`${this.client}_authorization_header`] = authorization_header;
    },
    methods: {
        clear: function () {

            Object.keys(this.config).forEach(key => {
                localStorage.removeItem(key)
                console.log('clearing', key)
            })
            this.config = {};
        },
        login: function () {

            if (!this.config.auth0_domain || !this.config.auth0_client_id)
                return alert('Domain and clientId requried')

            let authorizeEndpoint = `https://${this.config.auth0_domain}/authorize`

            const searchparams = {
                response_type: 'token',
                client_id: this.config.auth0_client_id,
                redirect_uri: callback_endpoint,
                audience: this.config.auth0_audience,
                state: this.client,
                scope: 'openid', // https://auth0.com/docs/api/authentication?shell#get-user-info
                response_type: this.config.response_type,
            };

            const searchkeys = Object.keys(searchparams);
            authorizeEndpoint = searchkeys.reduce((acc, key, index) => {
                const val = searchparams[key];
                if (index === 0)
                    return `${acc}?${key}=${val}`;
                return `${acc}&${key}=${val}`;
            }, authorizeEndpoint);

            window.location.href = authorizeEndpoint;
        }
    }
})



cognitoClient = new Vue({
    el: '#cognito',
    mixins: [jwtClient],
    data: {
        client: 'cognito',
        config: {}
    },
    created: function () {
        const cognito_domain = localStorage.getItem('cognito_domain');
        const cognito_region = localStorage.getItem('cognito_region');
        const cognito_client_id = localStorage.getItem('cognito_client_id');

        this.config.cognito_domain = cognito_domain;
        this.config.cognito_region = cognito_region;
        this.config.cognito_client_id = cognito_client_id;
        this.config.cognito_scope = 'aws.cognito.signin.user.admin';

        const cognito_access_token = localStorage.getItem('cognito_access_token');
        const cognito_expires_in = localStorage.getItem('cognito_expires_in');

        this.config.cognito_access_token = cognito_access_token;
        this.config.cognito_expires_in = cognito_expires_in;

        const jwt_validation_endpoint = localStorage.getItem(`${this.client}_jwt_validation_endpoint`);
        this.config[`${this.client}_jwt_validation_endpoint`] = jwt_validation_endpoint;

        // const authorization_header = localStorage.getItem(`${this.client}_authorization_header`);
        // this.config[`${this.client}_authorization_header`] = authorization_header;
    },
    methods: {
        clear: function () {

            Object.keys(this.config).forEach(key => {
                localStorage.removeItem(key)
                console.log('clearing', key)
            })
            this.config = {};
        },
        login: function () {

            if (!this.config.cognito_domain || !this.config.cognito_region || !this.config.cognito_client_id)
                return alert('Domain, region, and clientId requried')

            let authorizeEndpoint = `https://${this.config.cognito_domain}.auth.${this.config.cognito_region}.amazoncognito.com/oauth2/authorize`

            const searchparams = {
                response_type: 'token',
                client_id: this.config.cognito_client_id,
                redirect_uri: callback_endpoint,
                state: this.client,
                scope: this.config.cognito_scope
            };

            const searchkeys = Object.keys(searchparams);
            authorizeEndpoint = searchkeys.reduce((acc, key, index) => {
                const val = searchparams[key];
                if (index === 0)
                    return `${acc}?${key}=${val}`;
                return `${acc}&${key}=${val}`;
            }, authorizeEndpoint);

            console.log(authorizeEndpoint)

            window.location.href = authorizeEndpoint;
        }
    }
})



oktaClient = new Vue({
    el: '#okta',
    mixins: [jwtClient],
    data: {
        client: 'okta',
        config: {}
    },
    created: function () {
        const okta_issuer_uri = localStorage.getItem('okta_issuer_uri');
        const okta_authorization_server = localStorage.getItem('okta_authorization_server');
        // const authorization_server = localStorage.getItem(`${this.client}_authorization_server`);
        const okta_client_id = localStorage.getItem('okta_client_id');

        this.config.okta_issuer_uri = okta_issuer_uri;
        this.config.okta_authorization_server = okta_authorization_server;
        // this.config[`${this.client}_authorization_server`] = authorization_server;
        this.config.okta_client_id = okta_client_id;
        this.config.okta_scope = 'openid';

        const okta_access_token = localStorage.getItem('okta_access_token');
        const okta_expires_in = localStorage.getItem('okta_expires_in');

        this.config.okta_access_token = okta_access_token;
        this.config.okta_expires_in = okta_expires_in;

        const jwt_validation_endpoint = localStorage.getItem(`${this.client}_jwt_validation_endpoint`);
        this.config[`${this.client}_jwt_validation_endpoint`] = jwt_validation_endpoint;

        // const authorization_header = localStorage.getItem(`${this.client}_authorization_header`);
        // this.config[`${this.client}_authorization_header`] = authorization_header;
    },
    methods: {
        clear: function () {

            Object.keys(this.config).forEach(key => {
                localStorage.removeItem(key)
                console.log('clearing', key)
            })
            this.config = {};
        },
        login: function () {
            // reference: https://developer.okta.com/docs/api/resources/oidc#request-parameters


            if (!this.config.okta_issuer_uri || !this.config.okta_client_id) {
                return alert('Domain, region, and clientId requried')
            }

            let authorizeEndpoint = `https://${this.config.okta_issuer_uri}/oauth2/${this.config.okta_authorization_server}/v1/authorize`

            const searchparams = {
                response_type: 'token',
                client_id: this.config.okta_client_id,
                redirect_uri: callback_endpoint,
                state: this.client,
                scope: this.config.okta_scope,
                nonce: new Date().getTime(), // fake nonce
            };

            const searchkeys = Object.keys(searchparams);
            authorizeEndpoint = searchkeys.reduce((acc, key, index) => {
                const val = searchparams[key];
                if (index === 0)
                    return `${acc}?${key}=${val}`;
                return `${acc}&${key}=${val}`;
            }, authorizeEndpoint);

            console.log(authorizeEndpoint)

            window.location.href = authorizeEndpoint;
        }
    }
})