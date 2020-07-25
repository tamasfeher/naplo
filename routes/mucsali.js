var express = require("express");
var router= express.Router(),
    passport= require("passport"),
    User = require("../models/user"),
    Mucsali = require("../models/mucsali"),
    fs = require('fs'),
    multer  = require( 'multer' );
var mw = require("../middleware/index");
var routerObj = {jsFile: 'mucsali.js'};

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
    Mucsali.find({"csoport": "Körforgó"}).sort({sorszam: 1}).exec(function (err, kfk) {
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            Mucsali.find({"csoport": "Gumi"}).sort({sorszam: 1}).exec(function (err, gumik){
                if(err){
                    console.log(err);
                    res.redirect("/");
                }else{
                    Mucsali.find({"csoport": "Támolygó"}).sort({sorszam: 1}).exec(function (err, tmk){
                        if(err){
                            console.log(err);
                            res.redirect("/");
                        }else{
                            Mucsali.find({"csoport": "Wobbler"}).sort({sorszam: 1}).exec(function (err, wbk){
                                if(err){
                                    console.log(err);
                                    res.redirect("/");
                                }else{
                                    res.render("mucsali/index", {mucsalik:{kfk: kfk, gumik: gumik, tmk: tmk, wbk: wbk}, vars: routerObj});
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
    res.render("mucsali/uj", {vars: routerObj});
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
            req.flash("success","Hiba történt a műcsali létrehozása közben.");
            res.redirect("mucsali/uj");
        }else{
            req.flash("success","Sikeresen létrehozta a következő műcsalit: "+mucsali.marka+" "+mucsali.tipus);
            res.redirect("mucsali");
        }
    });
});

router.get("/edit/:id", mw.isLoggedIn, function(req, res){
    Mucsali.findById(req.params.id ,function (err, mucsali) {
        res.render("mucsali/edit", {mucsali: mucsali, vars: routerObj});
    })
});

router.post("/edit", [mw.isLoggedIn, upload.single('photo')], function(req, res){
    Mucsali.findByIdAndUpdate(req.body.id, req.body.mucsali, function (err, mucsali) {
        if(err){
            console.log(err);
        }else{
            if(typeof(req.file) !== 'undefined') {
                fs.unlink(_rootPath+'/uploads/mucsalik/'+mucsali.kepUrl, function (err) {
                    if(err){
                        console.log(err);
                    }
                });
                mucsali.kepUrl = req.file.filename;
            }

            var index = 0
            Object.values(req.body.halak).forEach(function (hal) {
                if(Object.keys(req.body.halak)[index] !== 'egyeb' && hal !== '') {
                    mucsali.halak[Object.keys(req.body.halak)[index]] += Number(hal)
                }
                index++
            })
            mucsali.halak.egyeb = req.body.halak.egyeb

            mucsali.save();
            req.flash("success","Sikeresen módosította a következő műcsalit: "+mucsali.marka+" "+mucsali.tipus);
            res.redirect("/mucsali");
        }
    });
});

router.post("/delete", mw.isLoggedIn, function(req, res){
    Mucsali.findByIdAndRemove(req.body.id, function (err, mucsali) {
        if(err){
            console.log(err);
        }else{
            fs.unlink(_rootPath+'/uploads/mucsalik/'+mucsali.kepUrl, function (err) {
                if(err){
                    console.log(err);
                }
            });
            req.flash("success","Sikeresen törölte a következő műcsalit: "+mucsali.marka+" "+mucsali.tipus);
            res.redirect("/mucsali");
        }
    });
});

module.exports = router;

function reorder(sorszam) {

}