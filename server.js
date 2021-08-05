require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const client = require('./configs/db');
require("./configs/passport-setup");
const passport = require('passport');
// const passport = require("passport");

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const port = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.status(200).send("Server running");
})


app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

client.connect(() => {
    console.log("Connected to Database");
})

app.listen(port, ()=>{
    console.log(`SERVER RUNNING ON PORT ${port}`);
})