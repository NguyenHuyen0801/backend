var mongoose = require("mongoose");

var schemaBook = new mongoose.Schema({
    Name: String,
    Author: String,
    Image: String,
    Cost: Number, 
})

module.exports = mongoose.model("Book", schemaBook)