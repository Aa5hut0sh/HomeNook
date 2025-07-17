const express = require("express");
const router =    express.Router();
const {ListingSchema} = require("../Schema.js");
const wrapAsync   = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLogedIn , isOwner , validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js");


//Index Routes
router.get("/" , wrapAsync(listingController.index));

//new Route

router.get("/new" , isLogedIn, listingController.renederNewFrom);

//Show Route

router.get("/:id" , wrapAsync(listingController.showListing));


//create route

router.post("/" ,isLogedIn , validateListing , wrapAsync(listingController.createListing));

//edit route

router.get("/:id/edit" , isLogedIn , isOwner , wrapAsync(listingController.renderEditForm));

//update route

router.put("/:id" , isLogedIn ,isOwner  , validateListing , wrapAsync(listingController.updateListing));

router.delete("/:id" , isLogedIn,isOwner , wrapAsync(listingController.eleteListing));

module.exports = router;