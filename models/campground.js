// Import mongoose package
const mongoose = require('mongoose');

// Set up the schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    price: String
});

// Compile the schema into a model
const campgroundModel = mongoose.model('Campground', campgroundSchema);

module.exports = campgroundModel;

