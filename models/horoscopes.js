var mongoose = require("mongoose");
var horoscopeSchema = new mongoose.Schema({
    text: String,
    image: String,
    author: String,
    hometown: String
});

module.exports = mongoose.model("horoscope", horoscopeSchema);