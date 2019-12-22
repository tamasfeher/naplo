var mongoose = require("mongoose");

var mucsaliSchema = mongoose.Schema({
    kepUrl: String,
    csoport: String,
    marka: String,
    tipus: String,
    halak: {
        bal: Number,
        bod: Number,
        cs: Number,
        dom: Number,
        har: Number,
        sug: Number,
        sul: Number,
        th: Number,
        vor: Number,
        egyeb: String
    },
    sorszam: Number,
    felh: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Mucsali", mucsaliSchema);
