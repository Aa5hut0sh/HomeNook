require('dotenv').config()
if(process.env.NODE_ENV!="production" ){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
 


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"public")));



const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connection Sucessful");
    }).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto :{
    secret: process.env.SECRET,
  },
  touchAfter : 24*3600,
});

store.on("error" , ()=>{
  console.log("ERROR IN MONGO SESSION STORE")
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true 
  }

};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  //for flash messages
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //for current user info
  res.locals.currUser = req.user;
  next();
}); 




app.use("/listings" , listings); 

app.use("/listings/:id/review" , reviews);

app.use("/" , users);





// Fallback route for unmatched paths
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});



app.use((err , req , res , next)=>{
  let {statusCode  = 500 , message= "Something went Wrong"} = err;
  res.status(statusCode).render("error.ejs" , {err});
  // res.status(statusCode).send(message);
})





app.listen(8080 , ()=>{
   console.log("server is listening to port : 8080");
});