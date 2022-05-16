var express        = require("express");
var router         = express.Router();
var Campground     = require("../models/campground");
var middleware     = require("../middleware");


// INDEX - show all campgrounds
router.get("/", function (req, res) {
	
	
	analytics.page({
  		userId: req.body.username,
  		category: 'landing',
  		properties: {
			url: 'https://holisticescapes-heroku-20.herokuapp.com/',
			path: '/',
			title: 'landing page',
			referrer: req.headers['referer']
  		}
	});
	
	
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/Index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});


//Create campground route

router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var cost = req.body.cost;
	var shdescription = req.body.shdescription;
	var longdescription = req.body.longdescription;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, cost: cost, shdescription: shdescription, longdescription: longdescription, author: author}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
				res.redirect("/campgrounds");
		}
	});
});

//New -shows form for campgrounds
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//Show
router.get("/:id", function(req, res){	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {	
		res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds")
	} else {
		if(foundCampground.author.id.equals(req.user._id)) {
			res.render("campgrounds/edit", {campground: foundCampground});
			} else {
				res.send("You need to be logged in");
		}
	}
});
}
});	


//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Your campground entry has been deleted");
			res.redirect("/campgrounds");
		}	
	});
});



module.exports = router;