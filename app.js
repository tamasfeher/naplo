var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user"),
    flash       = require("connect-flash"),
    path        = require('path');
global._rootPath = path.dirname(require.main.filename);

var indexRoutes = require("./routes/index"),
    pNaploRoutes = require("./routes/pnaplo"),
    mucsaliRoutes = require("./routes/mucsali"),
    kepRoutes    = require("./routes/kep");
var port = process.env.PORT || 3000;
var Murl = process.env.DATABASEURL || "mongodb://localhost/naplo";
mongoose.connect(Murl);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/assets"));
app.use(flash());
//seedDB();
app.use(methodOverride("_method"));
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.errorMes = req.flash("error");
    res.locals.successMes = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});
app.use(indexRoutes);
app.use("/pergetonaplo", pNaploRoutes);
app.use("/mucsali", mucsaliRoutes);
app.use("/kep", kepRoutes);
process.env.PWD = process.cwd()

// Then
app.use(express.static(process.env.PWD + '/'));
app.listen(port,process.env.IP);