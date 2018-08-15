import * as express from 'express';
import * as passport from 'passport';
const router = express.Router();
module.exports = router;

// Routes
router.get('/', index);
router.get('/callback', callback);
router.get('/error', error);

router.get('/auth',
  passport.authenticate('oauth2'));

router.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Route definitions
function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const {
    AUTHORIZATION_ENDPOINT,
    TOKEN_ENDPOINT,
    CLIENT_ID,
    CLIENT_SECRET,
    PORT
  } = process.env;

  res.render('index', {
    pagename: 'index',

    // optional parts for persistent storage
    // auth_endpoint: AUTHORIZATION_ENDPOINT,
    // token_endpoint: TOKEN_ENDPOINT,
    // client_id: CLIENT_ID,
    // client_secret: CLIENT_SECRET,
    // port: PORT,
    // title: 'Oauth2 Client',
  });
}

function callback(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.render('callback', { pagename: 'callback' });
}
function error(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.send({ error: ':c' });
}
