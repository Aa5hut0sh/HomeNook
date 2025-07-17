const User = require("../models/user.js");



module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs")
};


module.exports.signup = async(req,res)=>{

    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});

        let registeredUser =  await User.register(newUser , password );
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }

            req.flash("success" , "Welcome to HomeNook");
            res.redirect("/listings");
        })
        
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    

};


module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{
    req.flash("success" , "Welcome back to HomeNook!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }

        req.flash("success" ," You are logged out" );
        res.redirect("/listings");

    });
};