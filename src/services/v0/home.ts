import * as express from 'express';
import * as passport from 'passport';
const router = express.Router();
module.exports = router;

// Routes
router.get('/', index);
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
    YO_AUTHORIZATION_ENDPOINT,
    YO_TOKEN_ENDPOINT,
    CLIENT_ID,
    CLIENT_SECRET,
    PORT
  } = process.env;

  res.render('index', {
    auth_endpoint: YO_AUTHORIZATION_ENDPOINT,
    token_endpoint: YO_TOKEN_ENDPOINT,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    port: PORT,
    title: 'Node JS API App'
  });
}

function error(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.send({ error: ':c' });
}
