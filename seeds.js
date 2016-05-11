var mongoose = require("mongoose");
var horoscope = require("./models/horoscopes");

var data = [
    {
        text: "You are a Pisces! Isn't that great?", 
        image: "http://horoscopespot.net/wp-content/gallery/pisces/pisces-shadow.jpg",
        author: "Joe",
        hometown: "Missouri",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "You are a Taurus! And how!", 
        image: "http://orig09.deviantart.net/d858/f/2014/308/f/1/taurus_by_orion35-d8597zu.jpg",
        author: "Tom",
        hometown: "The Moon",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "You're a terrible person, Miss Aries!", 
        image: "http://orig02.deviantart.net/e6f5/f/2014/212/a/a/aries_by_orion35-d7t5blv.jpg",
        author: "Leaf",
        hometown: "Texas",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "You probably hate asparagus, Mr. Capricorn!", 
        image: "http://orig08.deviantart.net/1966/f/2012/056/0/b/0bda5c40ecfff52cd808fd907179782e-d49gxpx.jpg",
        author: "Bob",
        hometown: "Canada",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "Virgo? I 'ardly knew 'er!", 
        image: "https://edition.englishclub.com/wp-content/uploads/2011/07/06c-Virgo.png",
        author: "Elmo",
        hometown: "Azerbaijan",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "Aquariussssss AQUAARRIUUSSSSS", 
        image: "http://edgeba.webs.com/aquarius2.jpg?width=347",
        author: "Dan",
        hometown: "The Deep South",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "GEMINI??!!??!", 
        image: "http://www.zodiachoroscopesigns.com/gemini-horoscope-sign-05-1.png",
        author: "Stormgoat",
        hometown: "America",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "I'm a bat!!!!", 
        image: "http://www.moderndayastrologer.com/wp-content/uploads/2015/06/libra_by_fabera-d4rrdn5.jpg",
        author: "The Deep South",
        hometown: "Panama",
        date: "March 26 2015, 8:25pm"
    } ,
    {
        text: "THERE IS NO SIGN! ONLY ZUUL!", 
        image: "http://www.romanceways.com/files/2012/03/How-to-date-a-leo.jpg",
        author: "MISHA",
        hometown: "Jupiter",
        date: "March 26 2015, 8:25pm"
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