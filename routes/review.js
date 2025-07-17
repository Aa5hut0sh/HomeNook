const express = require("express");
const router =    express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync   = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../Schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLogedIn, isAuthor , validateReview  } = require("../middleware.js");


const reviewController = require("../controllers/reviews.js")



//post review route

router.post("/" ,isLogedIn, validateReview , wrapAsync(reviewController.createReview)); 

//delete review route

router.delete("/:reviewId" , isLogedIn  , isAuthor  , wrapAsync(reviewController.deleteReview));


module.exports = router