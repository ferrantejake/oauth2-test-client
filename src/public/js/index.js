
let oauthClient, jwtClient, scopeComponent;

// scopeComponent = new Vue({
//     data: {},
//     mounted: function () {
//         console.log('new scope mounted')
//     },
//     template: "label(for='scopes').col-4.text-right scopes \
//     input(v-model='config.scopes', name='scopes').col"
// })

const { pathname, host, protocol } = window.location;
const callback_endpoint = protocol + '//' + host + pathname + 'callback'


oauthClient = new Vue({
    el: "#oauth2Client",
    data: {
        config: {},
    },
    created: function () {
        let client_id = localStorage.getItem('client_id');
        let client_secret = localStorage.getItem('client_secret');
        let auth_endpoint = localStorage.getItem('auth_endpoint');
        // let token_endpoint = localStorage.getItem('token_endpoint');
        const { pathname, host, protocol } = window.location;
        const callback_endpoint = protocol + '//' + host + pathname + 'callback'

        this.config = {
            client_id,
            client_secret,
            auth_endpoint,
            // token_endpoint,
            callback_endpoint
        }
    },
    methods: {
        clearConfig: function () {
            this.config = {
                callback_endpoint
            };
            localStorage.removeItem('client_id');
            localStorage.removeItem('client_secret');
            localStorage.removeItem('auth_endpoint');
            localStorage.removeItem('token_endpoint');
        },
        startAuth: function () {
            try {
                const query = Object.keys(this.config).reduce(function (acc, key) {
                    const val = this.config[key];
                    if (val === '' || !!val)
                        throw new Error('missing value for', val)
                    return acc += '?' + key + '=' + val;

                    windows.location

                }, '?')
            } catch (e) {
                console.log(e);
                return;
            }
        }
    },
    updateConfigItem: function (x, y) {
        console.log('x', x)
        console.log('y', y)
    }
})

jwtClient = new Vue({
    el: "#jwtClient",
    data: {
        config: {}
    },
    mounted: function () {
        // named items
    },
    created: function () { },
    methods: {
        validateWithDroplit: function () {

        },
        clearConfig: function () {
            this.config = {};
        }
    }
})

auth0Client = new Vue({
    el: "#auth0Client",
    data: {
        config: {}
    },
    created: function () {
        console.log('mounted')

        let jwt_validation_endpoint = localStorage.getItem('jwt_validation_endpoint');
        let id_token = localStorage.getItem('id_token');
        let access_token = localStorage.getItem('access_token');

        this.config = {
            spa_client_id,
            domain,
            jwt_validation_endpoint,

            id_token,
            access_token,
            expires_in,
        }
    },
    methods: {
        clearConfig: function () {
            this.config = {};
            localStorage.removeItem('auth0_client_id');
            localStorage.removeItem('auth0_domain');
            localStorage.removeItem('auth0_jwt_validation_endpoint');
        },
        clearTokens: function () {
            this.config = {};
            localStorage.removeItem('auth0_access_token');
            localStorage.removeItem('auth0_id_token');
            localStorage.removeItem('auth0_expires_in');
        },
        retrieveTokens: function () {

        },
        validateWithDroplit: function () { },
    }
})


