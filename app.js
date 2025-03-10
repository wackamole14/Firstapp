var express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    Campground    = require("./models/campground"),
    seedDB        = require("./seeds"),
    Comment       = require("./models/comment"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    passport      = require("passport"),
	methodOverride= require("method-override"),
	flash         = require("connect-flash"),
    Analytics     = require('analytics-node'),
    analytics     = new Analytics('0FiyK6qY4D8oqPcjhL8d0Ww2TEYLEy26')

	

//Requiering routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"), 
	indexRoutes       = require("./routes/index")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); no longer active right now 

//connecting MongooseDB
mongoose.connect('mongodb+srv://Hannahkay:thisisthenewpassword@cluster0-bmnzo.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true, // Add this option to avoid another deprecation warning
	useFindAndModify: false // Add this option to avoid deprecation warnings for findAndModify
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

//Passport configuration
app.use(require("express-session")({
    secret: "myRealUniqueSecretArdillasRojas", // Changed this to a unique secret
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// app.listen(3000, () => {
// 	console.log('server listening on port 3000');
// });


var port = process.env.PORT || 8080;

var server= app.listen(port,function() {
console.log("app running on port 8080"); });




