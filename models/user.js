var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

// User Schema
var UserSchema = new mongoose.Schema({
    username: String, 
    password: String
});

// Adds a bunch of the methods that come with that package to the UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);