const client = require("../configs/db")

exports.deleteNote = (req,res) => {
    const noteId = req.noteId;
    client
        .query(`DELETE FROM notes WHERE noteid = '${noteId}'`)
        .then((data) => {
            res.status(200).json({
                message: "Deleted Successfully",
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: "Database Error"});
        })
}