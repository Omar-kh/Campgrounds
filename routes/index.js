const express = require('express');
const mainRouter = express.Router();
const campgroundModel = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const passport = require('passport');

mainRouter.get('/', (req, res, next) => {
   res.render('landing'); 
});
// Register
mainRouter.get('/register', (req, res, next) => {
    res.render('register');
});

mainRouter.post('/register', (req, res, next) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message);
            res.redirect('back');
        }
        req.flash('success', 'Welcome to YelpCamp, ' + user.username);
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});
// Login
mainRouter.get('/login', (req, res, next) => {
    res.render('login');
});

mainRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
})
);

// Logout
mainRouter.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

module.exports = mainRouter;