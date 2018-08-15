import { Router } from 'express';

const router: Router = Router();

const version = 'v0';

const home = require(`../services/${version}/index`);

router.use('/', home);

module.exports = router;