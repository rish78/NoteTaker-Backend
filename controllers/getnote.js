const client = require("../configs/db")

exports.getNote = (req,res) => {
    const noteId = req.noteId;
    
    client
        .query(`SELECT * FROM notes WHERE noteid = '${noteId}';`)
        .then((data) =>{
            const heading = data.rows[0].heading;
            const content = data.rows[0].content;
            const email = data.rows[0].email;

            console.log(email, req.email);
            if(email === req.email){
                res.status(200).json({
                    heading, content
                })
            }
            else{
                console.log("Wrong email");
                res.status(400).json({
                    error:"You are not authorised!",
                })
            }
            

            
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({error: "Database Error"});
        })
}