const express = require('express');
const campgroundsRouter = express.Router();
const campgroundModel = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const middleware = require('../middleware');

campgroundsRouter.get('/', (req, res, next) =>{
    campgroundModel.find({}, function (err, allcampgrounds) {
        if (err) {
            res.send('Ooops, something went wrong');
        } else {
            res.render('campgrounds', {campgrounds: allcampgrounds});
        }
    });
});

campgroundsRouter.get('/new', middleware.isLoggedIn, (req, res, next) => {
   res.render('new'); 
});

campgroundsRouter.get('/:id', (req, res, next) => {
    campgroundModel.findById(req.params.id).populate('comments').exec(function (err, chosenCampground) {
        if (err || !chosenCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            res.render('show', {displayedCampground: chosenCampground});
        }
    });
});

campgroundsRouter.post('/', middleware.isLoggedIn, (req, res, next) => {
    let campName = req.body.name;
    let campImage = req.body.image;
    let campDescription = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let price = req.body.price;
    let newCamp = {name: campName, image: campImage, description: campDescription, author: author, price: price};
    campgroundModel.create(newCamp, function (err, newCamp) {
        if (err) {
            res.send('Ooops, something went wrong');
        } else {
            req.flash('success', 'Campground created');
            res.redirect('/campgrounds');  
        }
    });
});

// Edit campground route

campgroundsRouter.get('/:id/edit', middleware.checkCampgroudOwnership, (req, res, next) => {
    
    campgroundModel.findById(req.params.id, function(err, foundCampground) {
        res.render('edit_campground', {campground: foundCampground});
    });
    
    
});

// Update campground route

campgroundsRouter.put('/:id', middleware.checkCampgroudOwnership, (req, res, next) => {
    campgroundModel.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.send('there was an error when updating the campground');
        } else {
            req.flash('success', 'Campground updated');
            res.redirect('/campgrounds/' + updatedCampground._id);
        }
    });
});

// Delete campground route

campgroundsRouter.delete('/:id', middleware.checkCampgroudOwnership, (req, res, next) => {
    campgroundModel.deleteOne({ _id: req.params.id }, function (err) {
       if(err) {
           res.send('Something went wrong');
           }
        req.flash('success', 'Campground deleted');   
        res.redirect('/campgrounds');
    });
});





module.exports = campgroundsRouter;
