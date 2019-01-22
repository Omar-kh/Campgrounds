const express = require('express');
const commentsRouter = express.Router({mergeParams: true});
const campgroundModel = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const middleware = require('../middleware');


commentsRouter.get('/new', middleware.isLoggedIn ,function (req, res, next) {
    campgroundModel.findById(req.params.id, function (err, campground) {
        if (err) {
            res.send('No corresponding campground found');
        }
        console.log(campground);
        res.render('new_comment', {campground: campground});
        
    });
});



commentsRouter.post('/', middleware.isLoggedIn, function (req, res, next) {
    campgroundModel.findById(req.params.id, function (err, campground) {
        if (err) {
            res.send('Ooops something went wrong');
        }
        Comment.create({ text: req.body.text, author: req.body.author }, function(err, comment){ 
                                    if(err){
                                        req.flash('error', 'Something went wrong');
                                        res.redirect('back');
                                    } else {
                                        comment.author.id = req.user._id;
                                        comment.author.username = req.user.username;
                                        comment.save();
                                        campground.comments.push(comment);
                                        campground.save();
                                        req.flash('success', 'Successfully added comment');
                                        res.redirect('/campgrounds/' + campground._id);
                                    } 
            
        });
    });                                    
});


commentsRouter.get('/:commentId/edit', middleware.checkCommentOwnership, (req, res, next) => {
    campgroundModel.findById(req.params.id, function(err, campground) {
       if(err || !campground) {
           req.flash('error', 'Campground not found');
           res.redirect('back');
       } 
       Comment.findById(req.params.commentId, function(err, comment) {
            if(err) {
                res.redirect('back');
                
            } else {
                res.render('edit_comment', {comment: comment, campgroundId: campground._id});
            }
        });
    });
});

commentsRouter.put('/:commentId', middleware.checkCommentOwnership, (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, function(err, comment) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment updated');
            res.redirect('/campgrounds');
        }
    });
});

commentsRouter.delete('/:commentId', middleware.checkCommentOwnership, (req, res, next) => {
    Comment.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            res.redirect('back');
        }
        req.flash('success', 'Campground deleted');
        res.redirect('/campgrounds/' + req.params.id);
    });
});




module.exports = commentsRouter;