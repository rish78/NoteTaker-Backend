const jwt = require('jsonwebtoken');
const client = require("../configs/db");

exports.verifytoken = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
        const userEmail = decoded.email;

       

        client
            .query(`SELECT * FROM users WHERE email = '${userEmail}';`)
            .then(data => {
                
                if(data.rows.length === 0){
                    res.status(400).json({ message: "Invalid token"})
                }
                else{
                    const name = data.rows[0].name;
                    req.email = userEmail;
                    req.name = name;
                    next();
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Database Error"});
            })
      });

    
}