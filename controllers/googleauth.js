const client = require("../configs/db");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
require("../configs/passport-setup");

// exports.googleauth = (req,res) => {
//     passport.authenticate("google", {
//         // scope: ["profile"],
//         scope: [
//           "https://www.googleapis.com/auth/userinfo.profile",
//           "https://www.googleapis.com/auth/userinfo.email",
//         ],
//       })
// }

exports.googleredirect = (req,res) => {
    
    const firstname = req.user.name.givenName;
    const email = req.user.emails[0].value;
    console.log("here");
    client
        .query(`SELECT * FROM users WHERE email = '${email}';`)
        .then((data) => {
            if(data.rows.length != 0){
                
                const token = jwt.sign(
                    {
                      email: email
                    },
                    process.env.SECRET_KEY
                  );
                  res.status(200).json({
                    message: "User logged in successfully",
                    token: token,
                });
                res.status(200).redirect(`http://127.0.0.1:5500/pages/dashboard/dashboard.html?token=${token}`);
                
            }
            else{
                client
                    .query(`INSERT INTO users (name, email) VALUES ('${firstname}', '${email}');`)
                    .then((data) => {
                        const token = jwt.sign({
                            email: email,
                        },
                        process.env.SECRET_KEY
                        );
                        res.status(200).json({
                            message: "User registered successfully",
                            token: token,
                        });
                        res.redirect("http://127.0.0.1:5500/pages/dashboard/dashboard.html?token=${token}");
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            message:"Database error"
                        })
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message:"Database error"
            })
        })
}