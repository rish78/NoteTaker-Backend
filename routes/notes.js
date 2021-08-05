const express = require('express');
const router = express.Router();
const {addnote} = require('../controllers/addnotes');
const {getNotes} = require('../controllers/getNotes');
const {updateNote} = require('../controllers/updateNote');
const {deleteNote} = require('../controllers/deleteNote');
const {verifytoken} = require("../middlewares/authmiddleware");
const { noteidparam } = require('../middlewares/noteidparam');

router.param("noteId", noteidparam);

router.post("/add", verifytoken, addnote);
router.get("/getNotes", verifytoken, getNotes);
router.put("/update/:noteId", verifytoken, updateNote);
router.delete("/delete/:noteId", deleteNote);

module.exports = router;