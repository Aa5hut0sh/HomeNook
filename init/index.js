require('dotenv').config()
if(process.env.NODE_ENV!="production" ){
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});

  for (let obj of initData.data) {
    // Geocode the location
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(obj.location)}`,
      {
        headers: {
          'User-Agent': 'HomeNookSeeder' // REQUIRED by Nominatim
        }
      }
    );

    const geoData = await geoRes.json();

    let geometry = null;
    if (geoData && geoData.length > 0) {
      geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      };
    }

    const newListing = new Listing({
      ...obj,
      owner: "6876522ecf470969ae65c06f", // your default owner ID
      geometry, // add the geoJSON object
    });

    await newListing.save();
  }

  console.log("Data was initialized");
};

initDB();
