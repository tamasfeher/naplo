var mwObj = {};

mwObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.session.redirectTo = req.originalUrl;
        res.redirect("/login");
    }
};


module.exports = mwObj;