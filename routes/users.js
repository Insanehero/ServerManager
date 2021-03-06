var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res){
  req.session.user = null;
  req.logout();
  res.redirect('/');
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login'}),
  function(req, res) {
    console.log('leggo');
    req.session.user = req.user;
    res.redirect('/');
});

router.get('/register/:username/:password', function(req, res){ //Secure because you have to be logged in as verified user to access.
  User.register(new User({
    username: req.params.username,
    password: req.params.password
  }),
  req.params.password,
  function(err, account){
    if(err) {
      console.log("Account creation error!", err);
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});


module.exports = router;
