var express = require("express");
var router= express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Bejegy = require("../models/pnaplo");
var mw = require("../middleware/index");

router.get("/", mw.isLoggedIn, function(req, res){
    Bejegy.find({'felh.id': req.user._id } ,function (err, bej) {
        if(err){
            console.log(err);
        }else{
            res.render("pnaplo/index", {bejegys: bej});
        }
    });

});

router.get("/beiras", mw.isLoggedIn, function(req, res){
    res.render("pnaplo/beiras");
});
router.post("/", mw.isLoggedIn, function(req, res){
    Bejegy.create(req.body.pnBejegy, function (err, bej) {
        if(err){
            var obj = Object.values(err.errors);

            obj.forEach(function (error) {
                console.log(error);
            });
            if(err.name === 'CastError'){
                if(err.kind === 'Number'){
                    if(err.path === 'atlCels'){
                        req.flash("success", "Kérem az átlaghőmérsékletet számmal adja meg! (°C)");
                    }else{
                        req.flash("success", "Kérem a fogott halak darabszámát számmal adja meg!");
                    }
                }
            }else{
                req.flash("success",err.name+': '+err.message);
            }
            res.redirect("pergetonaplo/beiras");
        }else{
            bej.felh.id = req.user._id;
            bej.felh.username = req.user.username;
            bej.save();
            res.redirect("pergetonaplo");
        }
    });
});

router.get("/osszesito", mw.isLoggedIn, function(req, res){
    Bejegy.aggregate([
        {$match: {"felh.username": req.user.username}},
        {$group: {
            _id:  {ev: { $year: "$idopont" }},
            nap: {$sum: 1},
            tbal: {$sum: "$balin"},
            tbod: {$sum: "$bodorka"},
            tcs: {$sum: "$csuka"},
            tdom: {$sum: "$domolyko"},
            thar: {$sum: "$harcsa"},
            tsug: {$sum: "$suger"},
            tsul: {$sum: "$sullo"},
            tth: {$sum: "$torpeharcsa"},
            tvk: {$sum: "$vorosszarnyu"}
        }
        },
        {$sort: {_id: -1}}], function (err, ossz) {
        if(err){
            console.log(err)
        }else{
            res.render("pnaplo/osszesito", {osszesitett: ossz});
        }
    });
});
module.exports = router;