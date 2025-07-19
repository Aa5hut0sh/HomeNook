const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
  let allListings =  await Listing.find({});

  res.render("listings/index.ejs" , {allListings});

};

module.exports.renederNewFrom = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
  let {id} = req.params;

  const listing =  await Listing.findById(id).populate({path:"reviews" , populate:{path: "author"}}).populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  
  res.render("listings/show.ejs" , {listing});
};


module.exports.createListing = async (req , res , next)=>{
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

  const Mapurl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;

  const response = await fetch(Mapurl);
  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Location not found");
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  let url = req.file.path;
  let filename = req.file.filename;


  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.image = {url,filename};
  newListing.owner = req.user._id;

    const geometry = {
    type: "Point",
    coordinates: [lon, lat] // GeoJSON expects [lng, lat]
  };
  newListing.geometry = geometry;

  await newListing.save();
  req.flash("success" , "New Lisiting Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async(req,res)=>{

  let {id} = req.params;

  const listing = await Listing.findById(id);

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload" , "/upload/w_250")
  res.render("listings/edit.ejs" , {listing , originalImage});
};

module.exports.updateListing = async(req,res)=>{
  let {id} = req.params;
  let listing =  await Listing.findByIdAndUpdate(id ,{...req.body.listing} );

  if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
  }
  

  req.flash("success" , "Lsiting updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
  let {id} = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success" , "Lsiting Deleted!");
  res.redirect("/listings");
};