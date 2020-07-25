var express = require("express");
var router= express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Bejegy = require("../models/pnaplo");
var mw = require("../middleware/index");
var request = require('ajax-request');
var routerObj = {jsFile: 'pnaplo.js', datepOn: true};

router.get("/", mw.isLoggedIn, function(req, res){
    routerObj.osszes = false;
    Bejegy.find({'felh.id': req.user._id } ,function (err, bej) {
        if(err){
            console.log(err);
        }else{
            res.render("pnaplo/index", {bejegys: bej, vars: routerObj});
        }
    }).sort({'idopont': -1}).limit(10);

});

router.get("/osszes", mw.isLoggedIn, function(req, res){
    routerObj.osszes = true;
    Bejegy.find({'felh.id': req.user._id } ,function (err, bej) {
        if(err){
            console.log(err);
        }else{
            res.render("pnaplo/index", {bejegys: bej, vars: routerObj});
        }
    }).sort({'idopont': -1});

});

router.get("/beiras", mw.isLoggedIn, function(req, res){
    res.render("pnaplo/beiras", {vars: routerObj});
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
            tvk: {$sum: "$vorosszarnyu"},
            egyeb: {$push: "$egyeb"}
        }
        },
        {$sort: {_id: -1}}], function (err, ossz) {
        if(err){
            console.log(err)
        }else{
            ossz = egyebForOsszesites(ossz)
            res.render("pnaplo/osszesito", {osszesitett: ossz, vars: routerObj});
        }
    });
});

router.get("/osszesito/hely", mw.isLoggedIn, function(req, res){
    Bejegy.aggregate([
        {$match: {"felh.username": req.user.username}},
        {$group: {
                _id:  {hely: "$hely" },
                nap: {$sum: 1},
                tbal: {$sum: "$balin"},
                tbod: {$sum: "$bodorka"},
                tcs: {$sum: "$csuka"},
                tdom: {$sum: "$domolyko"},
                thar: {$sum: "$harcsa"},
                tsug: {$sum: "$suger"},
                tsul: {$sum: "$sullo"},
                tth: {$sum: "$torpeharcsa"},
                tvk: {$sum: "$vorosszarnyu"},
                egyeb: {$push: "$egyeb"}
            }
        },
        {$sort: {_id: -1}}], function (err, ossz) {
        if(err){
            console.log(err)
        }else{
            ossz = egyebForOsszesites(ossz);
            res.render("pnaplo/hely", {osszesitett: ossz, vars: routerObj});
        }
    });
});

router.get("/osszesito/viz", mw.isLoggedIn, function(req, res){
    Bejegy.aggregate([
        {$match: {"hely":  { "$regex": "csi", "$options": "i" }}},
        {$group: {
                // _id:  { $regexFindAll: { input: "$hely", regex: /Pécsi-víz/i } },
                _id: null,
                nap: {$sum: 1},
                tbal: {$sum: "$balin"},
                tbod: {$sum: "$bodorka"},
                tcs: {$sum: "$csuka"},
                tdom: {$sum: "$domolyko"},
                thar: {$sum: "$harcsa"},
                tsug: {$sum: "$suger"},
                tsul: {$sum: "$sullo"},
                tth: {$sum: "$torpeharcsa"},
                tvk: {$sum: "$vorosszarnyu"},
                egyeb: {$push: "$egyeb"}
            }
        }
        ], function (err, ossz) {
        if(err){
            console.log(err)
        }else{
            // ossz = clearOsszForViz(ossz);
            console.log(ossz[0]._id)
            ossz = egyebForOsszesites(ossz);
            res.render("pnaplo/hely", {osszesitett: ossz, vars: routerObj});
        }
    });

});

router.post('/szuro', function (req, res) {
    let form = '';
    switch(req.body.id){
        case 'idopont':
            form = '<div id="filterBy" class="hidden">idopont</div><div><label for="dateFilterFrom">Kezdő nap:</label>' +
                '<input type="text" class="datepicker" id="dateFilterFrom"></div>' +
                '<div><label for="dateFilterTo">Záró nap:</label>' +
                '<input type="text" class="datepicker" id="dateFilterTo"></div>';
            break;
        case 'hely':
            form ='<div id="filterBy" class="hidden">hely</div><select id="filterPlace">' +
                '<option value="">Válassz helyet...</option>' +
                '<option value="Balaton">Balaton</option>' +
                '<option value="Bükkösdi-víz">Bükkösdi-víz</option>' +
                '<option value="Fekete-víz">Fekete-víz</option>' +
                '<option value="Gaja-patak">Gaja-patak</option>' +
                '<option value="Hótedra-tó">Hótedra-tó</option>' +
                '<option value="Karasica">Karasica</option>' +
                '<option value="Kökényi-tó">Kökényi-tó</option>' +
                '<option value="Malomvölgyi-tó">Malomvölgyi-tó</option>' +
                '<option value="Mattyi-tó">Mattyi-tó</option>' +
                '<option value="Pécsi-víz">Pécsi-víz</option>' +
                '<option value="Pécsi-víz">Pécsi-tó</option>' +
                '<option value="Rinya-patak">Rinya-patak</option>' +
                '</select><a class="btn btn-yellow btn-float-modal" href="/pergetonaplo/osszesito/hely">Összesítő</a>';
            break;
    }
    res.send(form);
});

function clearOsszForViz(ossz) {
    ossz.pop();
    console.log(ossz)
    return ossz;
}

function egyebForOsszesites(ossz){
    let egyebHalak = ['Jászkeszeg','Kárász','Nyúldomolykó','Paduc','Naphal','Küsz'];
    ossz.forEach(function (bejegy) {
        var ujEgyeb = [];
        var ujEgyebTomb = [];
        var egyeb = bejegy.egyeb.filter(function (el) {
            return el !== '';
        });
        egyeb.forEach(function (egy) {
            let egyebek = egy.split(', ');
            egyebek.forEach(function (egyb) {
                let egyTomb = egyb.split(' db ');
                egyebHalak.forEach(function (egyebHal) {
                    if(egyTomb[1] === egyebHal) {
                        if (typeof ujEgyeb[egyebHal] === 'undefined') ujEgyeb[egyebHal] = 0;
                        ujEgyeb[egyebHal] += parseInt(egyTomb[0]);
                    }
                });
            });
        });

        var i = 0;
        for (var key in ujEgyeb) {
            ujEgyebTomb[i] = ujEgyeb[key]+' db '+key;
            i++;
        }
        bejegy.egyeb = ujEgyebTomb.join(', ');
    });
    return ossz;
}

module.exports = router;