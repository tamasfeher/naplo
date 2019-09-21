var mongoose = require("mongoose");

var kepSchema = mongoose.Schema({
    feltoltes: {type: Date, default: Date.now},
    kepUrl: String,
    suly: String,
    hely: String,
    mucsali: String,
    felh: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});
module.exports = mongoose.model("Kep", kepSchema);