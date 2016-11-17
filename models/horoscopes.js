var mongoose = require("mongoose");
var horoscopeSchema = new mongoose.Schema({
    full_text       : String,
    abridged_text   : String,
    image           : String,
    name            : String,
    hometown        : String,
    date            : String,
    sign            : String
});

module.exports = mongoose.model("horoscope", horoscopeSchema);
