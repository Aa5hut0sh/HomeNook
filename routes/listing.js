const express = require("express");
const router =    express.Router();
const {ListingSchema} = require("../Schema.js");
const wrapAsync   = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLogedIn , isOwner , validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


//Index Routes
router.get("/" , wrapAsync(listingController.index));

//new Route

router.get("/new" , isLogedIn, listingController.renederNewFrom);

//search route

router.get("/search" , wrapAsync(listingController.search));

//filter

router.get("/filter/:category", wrapAsync(listingController.filter));

//Show Route

router.get("/:id" , wrapAsync(listingController.showListing));


//create route

router.post("/" ,isLogedIn , validateListing , upload.single('listing[image]') , wrapAsync(listingController.createListing));

//edit route

router.get("/:id/edit" , isLogedIn , isOwner , wrapAsync(listingController.renderEditForm));

//update route

router.put("/:id" , isLogedIn ,isOwner  , validateListing  , upload.single('listing[image]'), wrapAsync(listingController.updateListing));

router.delete("/:id" , isLogedIn,isOwner , wrapAsync(listingController.deleteListing));



module.exports = router;