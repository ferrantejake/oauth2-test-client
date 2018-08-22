import * as express from 'express';
import * as passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
const router = express.Router();
module.exports = router;

// Routes
router.get('/', index);
router.get('/callback', callback);
router.get('/error', error);

// router.get('/auth', passport.authenticate('oauth2'));

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

function callback(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const options = { pagename: 'callback' };
  res.render('callback', options);
}
function error(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.send({ error: ':c' });
}
