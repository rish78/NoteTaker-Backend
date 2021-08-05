const client = require("../configs/db");

exports.addnote = (req,res) => {
    const {heading, content} = req.body;



    client
        .query(`INSERT INTO notes (email, heading, content) VALUES ('${req.email}', '${heading}', '${content}');`)
        .then((data) => {
            res.status(200).json({message: "Note added successfully."});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({message: "Database error"});
        })
}