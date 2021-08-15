require("dotenv").config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const client = require("./db");


passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://infinite-coast-54217.herokuapp.com/auth/google/redirect",
      },
      
      // function to get profile details and a call back function
      (accessToken, refreshToken, profile, done) => {
       
        return done(null, profile);
         
        
      }
    )
  );

  passport.serializeUser(function(user, done) {
    
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
   
    done(null, user);
});