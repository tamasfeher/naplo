var mongoose = require("mongoose");

var pnBejegySchema = mongoose.Schema({
    felh: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    idopont: Date,
    hely: String,
    atlCels: Number,
    felhoKep: String,
    start: String,
    vege: String,
    //Halak
    balin: Number,
    bodorka: Number,
    csuka: Number,
    domolyko: Number,
    harcsa: Number,
    suger: Number,
    sullo: Number,
    vorosszarnyu: Number,
    torpeharcsa: Number,
    egyeb: String
});
module.exports = mongoose.model("pnBejegy", pnBejegySchema);