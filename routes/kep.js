var express = require("express");
var router= express.Router(),
    passport= require("passport"),
    User = require("../models/user"),
    Kep = require("../models/kep"),
    multer  = require( 'multer' );
var mw = require("../middleware/index");
var routerObj = {jsFile: 'kep.js'};

var storage = multer.diskStorage(
    {
        destination: './uploads/kepek/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, Date.now()+ '-' +file.originalname);
        }
    }
);
var upload = multer( { storage: storage } );

router.get("/", function(req, res){
    Kep.find(function (err, kep) {
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("kep/index", {kepek: kep, slickOn: true, vars: routerObj});
        }
    });
});
router.get("/uj", mw.isLoggedIn, function(req, res){
    res.render("kep/uj", {vars: routerObj});
});
router.post("/", [mw.isLoggedIn, upload.single('photo')], function(req, res){

    Kep.create(req.body.kep, function (err, kep) {
        kep.kepUrl = req.file.filename;
        kep.felh.id = req.user._id;
        kep.felh.username = req.user.username;
        console.log(kep.kepUrl);
        kep.save();
        if(err){
            console.log(err);
            res.redirect("kep/uj");
        }else{
            res.redirect("kep");
        }
    });
});

module.exports = router;