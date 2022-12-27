const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
});


// Middleware for hashing
registerSchema.pre("save", async function (next) {
    if (this.isModified("passeord")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
})

const Register = new mongoose.model("Register", registerSchema);

module.exports = Register;