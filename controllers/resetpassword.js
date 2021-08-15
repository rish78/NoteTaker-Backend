const jwt = require('jsonwebtoken');
const client = require('../configs/db');
const bcrypt = require('bcrypt');

exports.resetpassword = (req, res) => {
    const resetLink = req.params.token;

    console.log(resetLink);

    const {newPassword} = req.body;
    console.log(newPassword);

    if(resetLink) {
        jwt.verify(resetLink, process.env.RESET_SECRET_KEY, (error, decodedToken) => {
             if(error) {
               res.status(400).json({ message: 'Incorrect token or expired' })
             }

             else{
                const email = decodedToken.email;

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
                            res.status(500).json({message: "Database Error"});
                        })
                })

                
             }
             
             
            
        })
      }
}