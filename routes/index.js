var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root route

router.get('/', function(req, res){
	res.render("landing_copy0");
});



//register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser= new User({username: req.body.username});	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
   			 console.log(err);
   		return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Holistic Escapes " + user.username)
			res.redirect("/campgrounds");
		});
	});
});


//Login form

router.get("/login", function(req, res){
	res.render("login");
});


//handle loging logic

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
		 
});

//Logout route

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully");
	res.redirect("/campgrounds");
});



module.exports = router;