const jwt = require('jsonwebtoken');
const client = require('../configs/db');
const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

exports.resetpassword = (req, res) => {
    const resetLink = req.params.token;

    console.log(resetLink);

    const {newPassword} = req.body;
    console.log(newPassword);

    if(resetLink) {
        jwt.verify(resetLink, process.env.RESET_SECRET_KEY, (error, decodedToken) => {
             if(error) {
               res.status(400).json({ error: 'Incorrect token or expired' })
             }

             else{
                const email = decodedToken.email;

                
            let schema = new passwordValidator();                                                                // Validating Password conditions
    
            schema
                .is().min(8)                                                                                     // Minimum length 8
                .is().max(100)                                                                                   // Maximum length 100
                .has().uppercase()                                                                               // Must have uppercase letters
                .has().lowercase()                                                                               // Must have lowercase letters
                .has().digits(1)                                                                                 // Must have at least 2 digit
                .has().not().spaces()                                                                            // Should not have spaces
    
            if (!schema.validate(newPassword)) {
                return res.status(500).json({
                    error: "Input a Strong Password of minimum 8 characters consisting of upper and lowercase letters and atleast 1 digit."
                })
            }

                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err){
                        res.status(500).json({
                            error: "Internal Server Error",
                        });
                    }

                    client
                        .query(`UPDATE users SET password = '${hash}' WHERE email = '${email}'`)
                        .then((data) => {
                            res.status(200).json({message: "Password Reset Successfully!"});
                        })
                        .catch((err) =>{
                            console.log(err);
                            res.status(500).json({error: "Database Error"});
                        })
                })

                
             }
             
             
            
        })
      }
}