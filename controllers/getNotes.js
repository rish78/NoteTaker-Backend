const client = require("../configs/db")

exports.getNotes = (req,res) => {
    client.query(`SELECT * FROM notes WHERE email = '${req.email}'`).then((data) => {
        const filteredData = data.rows.map((note) => {
            return {
                noteId: note.noteid,
                heading: note.heading,
                content: note.content,
            }
        })
        res.status(200).json({
            message: "Success",
            data: filteredData,
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Database error occurred",
        })
    })
}