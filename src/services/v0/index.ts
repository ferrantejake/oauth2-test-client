import * as express from 'express';
import * as passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
const router = express.Router();
module.exports = router;

// Routes
router.get('/', index);
router.get('/callback', callback);
router.get('/error', error);

router.get('/auth', passport.authenticate('oauth2'));

router.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const options = { pagename: 'index' };
  res.render('index', options);
}

function auth(req: express.Request, res: express.Response, next: express.NextFunction): void {

    const { auth_endpoint, client_id, client_secret, callback_endpoint } = req.query;

    console.log('vars');
    console.log('AUTHORIZATION_ENDPOINT', auth_endpoint);
    // console.log('TOKEN_ENDPOINT', token);
    console.log('CLIENT_ID', client_id);
    console.log('CLIENT_SECRET', client_secret);
    // console.log('PORT', PORT);

    passport.use(new OAuth2Strategy({
      authorizationURL: AUTHORIZATION_ENDPOINT,
      tokenURL,
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: callback_endpoint
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
}

function callback(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.render('callback', { pagename: 'callback' });
}
function error(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.send({ error: ':c' });
}
