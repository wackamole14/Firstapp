//all Middleware

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Something went wrong, please try again")
			res.redirect("back");
		} else {
			if(foundCampground.author.id.equals(req.user._id)){
			next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
		}
	});
	}	else {
			req.flash("error", "Please log in to do that");
			res.redirect("back");
	}	
}	

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			if(foundComment.author.id.equals(req.user._id)){
			next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
 			}
           }
        });
    } else {
		req.flash("error", "Please log in to do that");
        res.redirect("back");
    }
}

//Middleware is logged in

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please log in or Sign Up");
	res.redirect("/login");
}



module.exports = middlewareObj;