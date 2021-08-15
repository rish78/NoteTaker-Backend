const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');

const {signup} = require('../controllers/signup');
const {signin} = require('../controllers/signin');
const {forgotpassword} = require('../controllers/forgotpassword');
const { resetpassword } = require('../controllers/resetpassword');
const { googleredirect } = require('../controllers/googleauth');
require("../configs/passport-setup");

app.get('/failed', (req, res) => res.send('You Failed to log in!'));

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:token', resetpassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/redirect',passport.authenticate('google', {failureRedirect: '/failed' }), googleredirect);
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

module.exports = router;