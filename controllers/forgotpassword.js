const client = require("../configs/db");
const jwt = require('jsonwebtoken');

exports.forgotpassword = (req,res) => {
    
    const {email} = req.body;

    client
        .query(`SELECT * FROM users WHERE email = '${email}';`)
        .then((data) => {
            if(data.rows.length===0){
                res.status(400).json({message:"Email does not exist"});
            }

            const resetLink = jwt.sign({
                    email:email,
                    date:new Date()
                },
                process.env.RESET_SECRET_KEY,
                { expiresIn: '10m' }
            );

            // update resetlink in db

            //send mail

            res.status(200).send({
                message: "Check your mail", 
                resetLink: resetLink,
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: "Databse error occured",
            })
        })
}