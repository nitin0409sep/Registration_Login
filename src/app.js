const express = require('express');

const app = express();

// DB 
require("./db/conn");

// Model
const Register = require('./model/register_model');

// Path Module
const path = require('path');

// Template Engine
const hbs = require('hbs');

// Hashing
const bcrypt = require('bcryptjs');

// Port 
const port = process.env.PORT || 80;

// Conversion of data from client side for our express application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Path
const static_path = path.join(__dirname, "../temp/partials")

// Views Directory
const view_path = path.join(__dirname, "../temp/views")

// Partial Path
const partial_path = path.join(__dirname, "../temp/partials")

// Middleware for static files
app.use(express.static(static_path));

//Template Engine Views Dir Path 
app.set("view engine", "hbs");
app.set("views", view_path);

// Partials Path
hbs.registerPartials(partial_path);

// Home Page
app.get('/', (req, res) => {
    res.render("index");
})


// POST Request -: Registration
app.post('/register', async (req, res) => {
    try {

        var pass = req.body.pass;
        var cpass = req.body.confirmpass;


        if (pass === cpass) {
            // Create Employee
            const data = new Register({
                name: req.body.name,
                email: req.body.email,
                password: pass,
                confirmpassword: cpass
            })


            // Middle Ware after register but before save -: see model

            const result = await data.save();   // Returns a promise

            // Rendering data
            res.status(200).render("registration", {
                name: req.body.name,
                email: req.body.email,
                password: req.body.pass,
                confirmpass: req.body.confirmpass
            });
        } else {
            res.status(400).send("Password and Confirm Password do not match")
        }
    } catch (err) {
        res.status(400).send(err);
    }

})


// POST Request -: Login
app.post('/login', async (req, res) => {
    try {
        var email = req.body.email;
        var pass = req.body.pass;

        // Checking email is valid/present in dataBase or not
        const result = await Register.findOne({ email: email });  // If email not found, catch block will execute

        // Converting in array object
        const arr = [result];

        // Fetching Password present in DB
        const dbPass = arr[0].password;

        // Compairing hash values -: bcrypt.compare(userValue, valueInDB)
        const val = await bcrypt.compare(pass, dbPass);

        if (val) {
            res.status(201).render("login", {
                email: email,
                pass: pass
            });
        } else {
            res.send("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR");
    }
})


// Listening Server
app.listen(port, () => {
    console.log(`Server has started at port:${port}`);
})


