require("dotenv").config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/redirect",
      },
      
      // function to get profile details and a call back function
      function (accessToken, refreshToken, profile, done) {
        console.log(`${process.env.CLIENT_ID}`);
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