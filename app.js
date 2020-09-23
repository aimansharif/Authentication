var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user");
    passportLocalMongoose = require("passport-local-mongoose");

// Connect to mongoDB server
mongoose.connect("mongodb://localhost/authentication_demo_app"), {useNewUrlParser: true, useUnifiedTopology: true };

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "Aiman is awesome coder!",
    resave: false,
    saveUninitialized: false
}));

// setting passport up to use in the application
app.use(passport.initialize()); 
app.use(passport.session());

// Serialize: encoding, serializing and encoding back into the session
// Deserialize: reading the session, taking the data and unencoding
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//============
//ROUTES
//============

// Default route
app.get("/", function(req, res){
    res.render("home");
});

// Secret page route
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

// Authentication Routes

//show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up 
// using User.register will sign up a new user with the username but the password will be hashed
// passport will authenticate the user using local and redirect the page to the secret page given no error
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
});

// LOGIN ROUTES

// render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    //Do nothing for now
});

//Logout of the application
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//Check to see whether the user is logged in or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

// setting the port: default is 3000
var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("App listening on port " + port);
});
