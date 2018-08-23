

window.getQueryParameters = function (str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this; }.bind({}))[0];
};


console.log('here')
const hash = window.location.hash;
let searchString = window.location.search;
if (hash.length > 0) {
    searchString = hash.replace('#', '?');
}

const query = window.getQueryParameters(searchString);

const access_token = query.access_token;
// const id_token = query.id_token;
const expires_in = query.expires_in;

if (!access_token) {
    console.log('error')
    window.location.pathname = '/error'
}

localStorage.setItem('access_token', access_token)
// localStorage.setItem('id_token', id_token)
localStorage.setItem('expires_in', expires_in)

console.log('success')
setTimeout(() => {
    window.location.pathname = '/';
}, 500)

// callback = new Vue({
//     created: function () {


//         // window

//         // const auth0_domain = localStorage.getItem('auth0_domain');
//         // const auth0_client_id = localStorage.getItem('auth0_client_id');
//         // const auth0_jwt_validation_endpoint = localStorage.getItem('auth0_jwt_validation_endpoint');

//         // this.config.auth0_domain = auth0_domain;
//         // this.config.auth0_client_id = auth0_client_id;
//         // this.config.auth0_jwt_validation_endpoint = auth0_jwt_validation_endpoint;
//     },
// })

