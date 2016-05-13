var mongoose = require("mongoose");
var horoscope = require("./models/horoscopes");

var data = [
    {
        text: "Your mother was a terrible scientist!!",
        image: "http://www.romanceways.com/files/2012/03/How-to-date-a-leo.jpg",
        author: "MISHA",
        hometown: "Jupiter",
        date: "May 12th 2016, 8:25pm"
    }
]

function seedDB(){
    horoscope.remove({}, function(err){
        if(err){
            console.log("Error: " + err);
        } else {
        console.log("removed horoscopes");
        data.forEach(function(seed){
            horoscope.create(seed, function (err, horoscope){
                if(err){
                    console.log("Error: " + err);
                } else {
                    horoscope.save();
                    console.log("added a horoscope");
                    //create a comment
                }
            });
        });
        };
    });

}

module.exports = seedDB;
