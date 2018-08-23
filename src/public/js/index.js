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
        const id_token = localStorage.getItem('id_token');
        const access_token = localStorage.getItem('access_token');
        const expires_in = localStorage.getItem('expires_in');

        this.config.id_token = id_token;
        this.config.access_token = access_token;
        this.config.expires_in = expires_in;

        const authorization_header = localStorage.getItem('authorization_header');
        this.config.authorization_header = authorization_header;
        const jwt_validation_endpoint = localStorage.getItem('jwt_validation_endpoint');
        this.config.jwt_validation_endpoint = jwt_validation_endpoint;

        this.inputTimeout = new Date();
        this.hasDebounced = () => this.inputTimeout.getTime() < (new Date().getTime() - 100);
        this.mutex = new Mutex(this.hasDebounced);
        this.retryCount = 0;
    },
    methods: {
        clearTokens: function () {
            const items = [
                // `${this.client}_access_token`,
                // `${this.client}_id_token`,
                // `${this.client}_expires_in`
                `access_token`,
                `id_token`,
                `expires_in`
            ];

            items.forEach(i => {
                delete this.config[i];
                localStorage.removeItem(i);
                console.log('clearing', i)
            });

            vm.$forceUpdate();
        },
        validateWithDroplit: function () {
            if (!this.config.jwt_validation_endpoint) {
                return alert('validation endpoint required')
            }
            if (!this.config.authorization_header) {
                return alert('authorization required')
            }

            const options = {
                headers: {
                    'Authorization': this.config.authorization_header,
                    'Content-Type': 'application/json'
                },
                responseType: 'json'
            }
            const droplitClient = axios.create(options);
            const body = {
                accessToken: this.config.access_token,
                // idToken: this.config.id_token,
            };

            droplitClient
                .post(this.config.jwt_validation_endpoint, body)
                .then(console.log)
                .catch(console.log)
            // .then(response => (this.info = response))

            // const options = {
            //     headers: {
            //         // 'Access-Control-Allow-Origin': '*',
            //         'Authorization': this.config.authorization_header,
            //         'Content-Type': 'application/json'
            //     },
            //     method: 'POST',
            //     body: {
            //         idToken: this.config.id_token,
            //         accessToken: this.config.access_token,
            //     },
            //     // mode: 'no-cors'
            // }
            // const requestVerification = new Request(this.config.jwt_validation_endpoint, options);

            // console.log('starting request')
            // fetch(requestVerification)
            //     .then(response => {
            //         if (response.status === 200) {
            //             return response.json();
            //         } else {
            //             console.log(response)
            //             throw new Error('Something went wrong on api server!');
            //         }
            //     })
            //     .then(json => {
            //         console.log('json')
            //         console.log(json)
            //         // myImage.src = URL.createObjectURL(blob);
            //     })
            //     .catch(error => {
            //         console.log('error')
            //         console.log(error)
            //     });
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
                // scope: this.config.scope,
                response_type: this.config.response_type,
            };

            const searchkeys = Object.keys(searchparams);
            authorizeEndpoint = searchkeys.reduce((acc, key, index) => {
                const val = searchparams[key];
                if (index === 0)
                    return `${acc}?${key}=${val}`;
                return `${acc}&${key}=${val}`;
            }, authorizeEndpoint);

            // console.log(authorizeEndpoint)

            window.location.href = authorizeEndpoint;
        }
    }
})


