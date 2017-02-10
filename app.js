
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

//REQURING ROUTES
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// console.log(process.env.DATABASEURL);
// "mongodb://localhost/yelp_camp_v8"
//DB Connect
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://wooz:password@ds147789.mlab.com:47789/wooz_yelpcamp");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//SEED THE DATA BASE
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret, secret, I've got a secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



//LISTEN===============================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER HAS STARTED") ;
});