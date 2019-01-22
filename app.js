// Import packages
const express           = require('express');
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const campgroundModel   = require('./models/campground');
const Comment           = require('./models/comment');
const seedDB            = require('./seeds');
const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const User              = require('./models/user');
const methodOverride    = require('method-override');
const flash             = require('connect-flash');

const mainRouter        = require('./routes/index');
const campgroundsRouter = require('./routes/campgrounds');
const commentsRouter    = require('./routes/comments');

// Connect to the database
mongoose.connect('mongodb://localhost/YelpCamp', { useNewUrlParser: true });

// Using the connection to the 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error while connecting'));


// Initialize express
const app = express();

// Set the view engine
app.set('view engine', 'pug');

// Serve the static assets
app.use(express.static( __dirname + '/public'));
// User the body parser
app.use(bodyParser.urlencoded({extended: true}));


// Initialize data
//seedDB();

// Method override
app.use(methodOverride('_method'));

// Use flash
app.use(flash());

// Configure passport
app.use(require('express-session')(
    {
        secret:'This is a secret',
        resave: false,
        saveUninitialized: false
    }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Sending the user info to templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


// Routes
app.use('/', mainRouter);
app.use('/campgrounds', campgroundsRouter);      
app.use('/campgrounds/:id/comments', commentsRouter);



// Comments ROUTES


// Authentication routes


// Open the server
app.listen(process.env.PORT, console.log('Your super server is running at port ' + process.env.PORT));
