window.addEventListener('load', function () {

    const webAuth = new auth0.WebAuth({
        domain: 'YOUR_AUTH0_DOMAIN',
        clientID: 'YOUR_CLIENT_ID',
        responseType: 'token id_token',
        audience: 'https://YOUR_AUTH0_DOMAIN/userinfo',
        scope: 'openid',
        redirectUri: window.location.href
    });

    const loginBtn = document.getElementById('btn-login');

    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        webAuth.authorize();
    });

});