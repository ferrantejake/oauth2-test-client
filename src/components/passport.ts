
import * as passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

export function init() {
    const {
        AUTHORIZATION_ENDPOINT,
        TOKEN_ENDPOINT,
        CLIENT_ID,
        CLIENT_SECRET,
        PORT
      } = process.env;

    console.log('vars');
    console.log('AUTHORIZATION_ENDPOINT', AUTHORIZATION_ENDPOINT);
    console.log('TOKEN_ENDPOINT', TOKEN_ENDPOINT);
    console.log('CLIENT_ID', CLIENT_ID);
    console.log('CLIENT_SECRET', CLIENT_SECRET);
    console.log('PORT', PORT);

    passport.use(new OAuth2Strategy({
        authorizationURL: AUTHORIZATION_ENDPOINT,
        tokenURL: TOKEN_ENDPOINT,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}/auth/callback`
    },
        function (accessToken: string, refreshToken: string, profile: any, cb: any) {
            console.log('transaction successful');
            console.log('access token:', accessToken);
            console.log('refresh token:', refreshToken);
            console.log('profile:', profile);
            return cb(null, { user: 'jake' });
        }
    ));
}