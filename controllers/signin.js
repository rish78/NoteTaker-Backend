const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const client = require('../configs/db');

exports.signin = (req, res) => {
    const {email, password} = req.body;

   
    // const isValid = temporaryData.findIndex((ele) => (ele.email === email));
    client
    .query(`SELECT * FROM users WHERE email = '${email}';`)
    .then((data) => {
        if (data.rows.length === 0) {
            res.status(400).json({message: "User does not exist, sign up instead!"})
        }
        else{

            bcrypt.compare(password, data.rows[0].password, (err, result) => {
                // result == true
                if(err){
                    console.log(err);
                    res.status(500).json({message:"Internal Server Error"});
                }
                else if(result===true){
                    const token = jwt.sign({
                        email: email,
                    },
                    process.env.SECRET_KEY
                    );

                    

                    res.status(200).json({
                        message: "User logged in successfully",
                        token:token,
                    });
                }
                else{
                    res.status(400).json({message: "Incorrect password"})
                }

            });
            
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: "Database error occured",
        })
    });

    
}
