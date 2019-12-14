var express = require("express");
var router= express.Router(),
    passport= require("passport"),
    User = require("../models/user"),
    Mucsali = require("../models/mucsali"),
    multer  = require( 'multer' );
var mw = require("../middleware/index");

var storage = multer.diskStorage(
    {
        destination: './uploads/mucsalik/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, Date.now()+ '-' +file.originalname);
        }
    }
);
var upload = multer( { storage: storage } );


router.get("/", function(req, res){
    Mucsali.find({"csoport": "Körforgó"} ,function (err, kfk) {
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            Mucsali.find({"csoport": "Gumi"} ,function (err, gumik){
                if(err){
                    console.log(err);
                    res.redirect("/");
                }else{
                    Mucsali.find({"csoport": "Támolygó"} ,function (err, tmk){
                        if(err){
                            console.log(err);
                            res.redirect("/");
                        }else{
                            Mucsali.find({"csoport": "Wobbler"} ,function (err, wbk){
                                if(err){
                                    console.log(err);
                                    res.redirect("/");
                                }else{
                                    res.render("mucsali/index", {mucsalik:{kfk: kfk, gumik: gumik, tmk: tmk, wbk: wbk}});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/uj", mw.isLoggedIn, function(req, res){
    res.render("mucsali/uj");
});

router.post("/", [mw.isLoggedIn, upload.single('photo')], function(req, res){
    Mucsali.create(req.body.mucsali, function (err, mucsali) {
        mucsali.kepUrl = req.file.filename;
        mucsali.felh.id = req.user._id;
        mucsali.felh.username = req.user.username;
        mucsali.halak = req.body.halak;
        mucsali.save();
        if(err){
            console.log(err);
            res.redirect("mucsali/uj");
        }else{
            res.redirect("mucsali");
        }
    });
});

router.get("/edit/:id", mw.isLoggedIn, function(req, res){
    Mucsali.findById(req.params.id ,function (err, mucsali) {
        res.render("mucsali/edit", {mucsali: mucsali});
    })
});

router.post("/edit", mw.isLoggedIn, function(req, res){
    Mucsali.findByIdAndUpdate(req.body.id, req.body.mucsali, function (err, mucsali) {
        if(err){
            console.log(err);
        }else{
            mucsali.halak = req.body.halak;
            mucsali.save();
            res.redirect("/mucsali");
        }
    });
});

module.exports = router;