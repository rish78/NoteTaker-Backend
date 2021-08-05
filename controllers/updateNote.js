const client = require("../configs/db")

exports.updateNote = (req,res) => {
    const noteId = req.noteId;
    const {heading, content} = req.body;
    client
        .query(`UPDATE notes SET heading = '${heading}' , content = '${content}' WHERE noteid = '${noteId}';`)
        .then((data) =>{
            res.status(200).json({message: "Note Updated Successfully!"});
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({message: "Database Error"});
        })
}