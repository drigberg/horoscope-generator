var mongoose = require("mongoose");
var horoscope = require("./models/horoscopes");

var data = [
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/aquarius.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Aquarius"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/aries.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Aries"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/capricorn.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Cancer"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/pisces.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Capricorn"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/taurus.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Gemini"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/gemini.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Leo"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/cancer.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Libra"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/leo.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Pisces"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/virgo.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Sagittarius"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/libra.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Scorpius"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/scorpius.png",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Taurus"
    },
    {
        full_text       : "Your mother was a terrible scientist!!",
        abridged_text   : "Misha's mother was a terrible scientist!!",
        image           : "assets/sagittarius.jpg",
        author          : "MISHA",
        hometown        : "Jupiter",
        date            : "May 12th 2016, 8:25pm",
        sign            : "Virgo"
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
