const express = require("express");
const router =    express.Router();
const {ListingSchema} = require("../Schema.js");
const wrapAsync   = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLogedIn , isOwner} = require("../middleware.js");

const validateListing = (req,res,next) =>{
  let {error} = ListingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(" ,")
    throw new ExpressError(400, error)
  }else{
    next();
    }
};

//Index Routes
router.get("/" , wrapAsync(async(req,res)=>{
  let allListings =  await Listing.find({});

  res.render("listings/index.ejs" , {allListings});

}));

//new Route

router.get("/new" , isLogedIn, (req,res)=>{
  res.render("listings/new.ejs");
})

//Show Route

router.get("/:id" , wrapAsync(async(req,res)=>{
  let {id} = req.params;

  const listing =  await Listing.findById(id).populate({path:"reviews" , populate:{path: "author"}}).populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  
  res.render("listings/show.ejs" , {listing});
}));


//create route

router.post("/" ,isLogedIn , validateListing , wrapAsync(async (req , res , next)=>{
  // let {title , description , image , price , location , country} = req.body;

  

  // let newListing = new Listing({
  //   title:title,
  //   description:description,
  //   image:image,
  //   price:price,
  //   location:location,
  //   country:country
  // });

  // if(!req.body.listing){
  //   throw new ExpressError(400 ,"Send Valid data for listings" );
  // }



  // let result = listingSchema.validate(req.body);
  // if(result.error){
  //   throw new ExpressError(400, result.error)
  // }

  let listing = req.body.listing;
  const newListing = new Listing(listing);

  newListing.owner = req.user._id;


  await newListing.save();
  req.flash("success" , "New Lisiting Created!");
  res.redirect("/listings");
})
);

//edit route

router.get("/:id/edit" , isLogedIn , isOwner , wrapAsync(async(req,res)=>{

  let {id} = req.params;

  const listing = await Listing.findById(id);

  res.render("listings/edit.ejs" , {listing});
}
));

router.put("/:id" , isLogedIn ,isOwner  , validateListing , wrapAsync(async(req,res)=>{
  
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
  req.flash("success" , "Lsiting updated!");
  res.redirect(`/listings/${id}`);
}));

router.delete("/:id" , isLogedIn,isOwner , wrapAsync(async(req,res)=>{
  let {id} = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success" , "Lsiting Deleted!");
  res.redirect("/listings");
}));

module.exports = router;