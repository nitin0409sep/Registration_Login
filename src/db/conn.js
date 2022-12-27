const mongoose = require('mongoose');

mongoose.set('strictQuery', true)

mongoose.connect("mongodb://127.0.0.1:27017/registration").then(() => {
    console.log("Connection Successfull");
}).catch((err) => {
    console.log(err);
})