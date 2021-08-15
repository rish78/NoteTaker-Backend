const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require("jsonwebtoken");
const client = require('../configs/db');

// const temporaryData = [
//     {
//         name: "Rishabh1",
//         "email": "rishabh1@gmail.com",
//         password:"Helloooo1"
//     },
//     {
//         name: "Rishabh2",
//         email: "rishabh2@gmail.com",
//         password:"Helloooo1"
//     },
//     {
//         name: "Rishabh3",
//         email: "rishabh3@gmail.com",
//         password:"Helloooo1"
//     },
//     {
//         name: "Rishabh4",
//         email: "rishabh4@gmail.com",
//         password:"Helloooo1"
//     },
//     {
//         name: "Rishabh5",
//         email: "rishabh5@gmail.com",
//         password:"Helloooo1"
//     },
// ]


exports.signup = (req,res) => {
    // console.log(req.body);
    const {name, email, password} = req.body;

   
    // const isValid = temporaryData.findIndex((ele) => (ele.email === email));
    client
    .query(`SELECT * FROM users WHERE email = '${email}';`)
    .then((data) => {
        console.log(data);
        if (data.rows.length != 0) {
            res.status(400).json({message: "User already exists"})
        }
        else{
    
            
    
            let schema = new passwordValidator();                                                                // Validating Password conditions
    
            schema
                .is().min(8)                                                                                     // Minimum length 8
                .is().max(100)                                                                                   // Maximum length 100
                .has().uppercase()                                                                               // Must have uppercase letters
                .has().lowercase()                                                                               // Must have lowercase letters
                .has().digits(1)                                                                                 // Must have at least 2 digit
                .has().not().spaces()                                                                            // Should not have spaces
    
            if (!schema.validate(password)) {
                return res.status(500).json({
                    error: "Input a Strong Password of minimum 8 characters consisting of upper and lowercase letters and atleast 1 digit."
                })
            }
            else{
                
                const token = jwt.sign({
                    email: email,
                },
                process.env.SECRET_KEY
                );

                bcrypt.hash(password, 10, (err, hash) => {
                    if (err){
                        res.status(500).json({
                            error: "Internal Server Error",
                        });
                    }
    
                    const user = {
                        name,
                        email,
                        password: hash,
                    };
    
                    // temporaryData.push(user);
                    // console.log(temporaryData);
                    client
                    .query(`INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}');`)
                    .then((data) => {
                        console.log(data);
                        
                        res.status(200).json({
                            message: "User registered successfully",
                            token:token,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error: "Databse error occured",
                        })
                    })
    
                });
            }
            
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: "Databse error occured",
        })
    });

    
}
