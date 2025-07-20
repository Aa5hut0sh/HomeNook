const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
  let allListings =  await Listing.find({});

  res.render("listings/index.ejs" , {allListings , selectedCategory: "All"});

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

module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;

    // Get updated location
    const updatedLocation = req.body.listing.location;

    // Geocode the new location
    const mapUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(updatedLocation)}`;
    const response = await fetch(mapUrl);
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }

    // Extract coordinates
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    // Build the updated fields
    const updatedFields = {
      ...req.body.listing,
      geometry: {
        type: "Point",
        coordinates: [lon, lat] // GeoJSON expects [longitude, latitude]
      }
    };

    // If a new image was uploaded, add it
    if (typeof req.file !== 'undefined') {
      updatedFields.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // Update the listing
    const listing = await Listing.findByIdAndUpdate(id, updatedFields, { new: true });

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing.");
    res.redirect("back");
  }
};


module.exports.deleteListing = async(req,res)=>{
  let {id} = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success" , "Lsiting Deleted!");
  res.redirect("/listings");
};


module.exports.search = async(req,res)=>{

    let {location} = req.query ;
    let listings = await Listing.find({
        location: { $regex: location, $options: 'i' }
    });
    res.render("listings/search.ejs" , {listings , location});

};

module.exports.filter = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category: new RegExp(`^${category}$`, 'i') });
    res.render("listings/index.ejs", { allListings , selectedCategory: category });
};