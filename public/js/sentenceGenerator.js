// var horoscope = require("./models/horoscope.js")
$(document).ready(function() {
    horoscope.loadGrammar();
    horoscope.loadCalendar();
    if ($('li').length > $('li:visible').length) {
        $("#showMore").show();
    }
});

$("#generate").click(function() {
    horoscope.processHoroscopeForm();
});

$("#showMore").click(function () {
    $('li:hidden').slice(0, 10).show();
    if ($('li').length == $('li:visible').length) {
        $("#showMore").fadeOut(2000);
    }
});

var horoscope = {
    sentence_types : {},
    grammar : {},
    calendar : {},
    userData : {
        "name" : "",
        "hometown" : "",
        "birthday" : "",
        "sign" : ""
    },
    date: "",
    sentence: {
        complete: false,
        content: [],
        tags: {},
        possibleConversions : [],
        testForAgreement : true,
        newText : "",
        cleanedContent : ""
    } ,
    tripwire : false,
    initializeHoroscope : function(){
        this.userData.name = $("#userName").val();
        this.userData.hometown = $("#hometown").val();
        this.userData.birthday = $("#birthday").val();
        this.date = moment().format("MMMM Do YYYY, h:mm a");
        if (this.userData["name"] !== ""){
            this.sentence_types["name_signDeclaration"] = {
                "object" : "sign",
                "voice" : "active",
                "name" : true,
                "tense" : "present",
                "person" : "third" ,
                "verbtype" : "linking"
            };
            this.grammar["@Subject"]["@Name"] = {
                "weight" : 50 ,
                "person" : "third" ,
                "name" : true
            };
            this.grammar["@Name"] = {};
            this.grammar["@Name"][horoscope.userData["name"]] = {
                "weight" : 4
            };
        }
        // this.userData.sign = checkForSign(horoscope.userData.birthday);
        this.sentence.content = ["@ROOT"];
        this.sentence.complete = false;
        this.sentence.tags = this.sentence_types[Object.keys(this.sentence_types)[Math.floor(Math.random()*Object.keys(this.sentence_types).length)]];
        //display paragraph, with spaces between elements
        return this
    } ,
    generateSentence : function(){
        //var active_grammar = grammars[Object.keys(grammars)[Math.floor(Math.random()*Object.keys(grammars).length)]]
        this.sentence.complete = false;
        this.tripwire = 0;
        //convert nonterminals until only terminals are left
        while (this.sentence.complete == false){
        //while (tripwire < 12){
            //tripwire += 1;
            this.sentence.complete = true;
            for (var index = 0; index < this.sentence.content.length; index++){
                if (this.sentence.content[index] in this.grammar){
                    this.sentence.possibleConversions = [];
                    this.sentence.complete = false;
                    for (following in this.grammar[this.sentence.content[index]]){
                        this.sentence.testForAgreement = true;
                        for (tag in this.sentence.tags) {
                            if (tag in this.grammar[this.sentence.content[index]][following]) {
                                if (this.grammar[this.sentence.content[index]][following][tag] !== this.sentence.tags[tag]) {
                                    this.sentence.testForAgreement = false;
                                }
                            }
                        }
                        if (this.sentence.testForAgreement == true) {
                            for (var freq = 0; freq < this.grammar[this.sentence.content[index]][following]["weight"]; freq++){
                                this.sentence.possibleConversions.push(following);
                            }
                        }
                    }
                    this.sentence.newText = this.sentence.possibleConversions[Math.floor(Math.random()*this.sentence.possibleConversions.length)];
                    if(this.sentence.newText){
                        this.sentence.newText = this.sentence.newText.split(" ");
                        for (var i = 0; i < this.sentence.newText.length; i++){
                            if (i == 0){
                                this.sentence.content[index] = this.sentence.newText[i];
                            } else {
                                this.sentence.content.splice((index + i), 0, this.sentence.newText[i]);
                            }
                        }
                    } else {
                        console.log("I accidentally evaluated a terminal!!!");
                    }
                }
            }
        }
        return this
    } ,
    cleanSentence : function(){
        this.sentence.cleanedContent = "";
        if (this.sentence.content) {
            for (i = 0; i < this.sentence.content.length; i++){
                if (i == 0){
                    this.sentence.cleanedContent = this.sentence.content[i];
                } else {
                    if (this.sentence.content[i] == "a" && this.sentence.content[i+1][0] in {"a":0,"e":0,"i":0,"o":0,"u":0, "A":0, "E":0, "I":0, "O":0, "U":0}){
                        this.sentence.content[i] = "an";
                    }
                    if (this.sentence.content[i] !== "," && this.sentence.content[i-1] !=- ";"){
                        this.sentence.cleanedContent += (" " + this.sentence.content[i]);
                    } else {
                         this.sentence.cleanedContent += this.sentence.content[i];
                    }
                }
            };
            this.sentence.cleanedContent = this.sentence.cleanedContent.charAt(0).toUpperCase() + this.sentence.cleanedContent.slice(1) + "!";
        };
        return this
    } ,
    loadGrammar: function(){
        $.ajax({
            url: "/json/grammars.json",
            dataType: "json",
            success: function(data) {
                horoscope.grammar = data.grammar;
                horoscope.sentence_types = data.sentence_types;
            }
        });
    } ,
    loadCalendar: function(){
        $.ajax({
            url: "/json/calendar.json",
            dataType: "json",
            success: function(data) {
                horoscope.calendar = data;
            }
        });
    } ,
    processHoroscopeForm: function(){
        async.series([
            horoscope.initializeHoroscope(),
            horoscope.generateSentence(),
            horoscope.cleanSentence(),
            $.ajax({
                type: 'POST',
                url:  "/horoscopes",
                data:  {
                    text : horoscope.sentence.cleanedContent,
                    name : horoscope.userData["name"],
                    hometown : horoscope.userData["hometown"],
                    birthday : horoscope.userData["birthday"],
                    date : horoscope.date
                },
                dataType: 'json',
                success: function(data){
                    if (data.redirect){
                        window.location.href = data.redirect;
                    };
                }
            })
        ]);
    }
}

// function checkForSign(date){
//     if (moment(date).format("MM") === "01"){
//         var sign = (parseInt(moment(date).format("DD")) <= 21) ? "Capricorn" : "Aquarius";
//     } elseif (moment(date).format("MM") === "02"){
//         var sign = (parseInt(moment(date).format("DD")) <= 20) ? "Aquarius" : "Pisces";
//     } elseif (moment(date).format("MM") === "03"){
//         var sign = (parseInt(moment(date).format("DD")) <= 20) ? "Pisces" : "Aries";
//     } elseif (moment(date).format("MM") === "04"){
//         var sign = (parseInt(moment(date).format("DD")) <= 20) ? "Aries" : "Taurus";
//     } elseif (moment(date).format("MM") === "05"){
//         var sign = (parseInt(moment(date).format("DD")) <= 21) ? "Taurus" : "Gemini";
//     } elseif (moment(date).format("MM") === "06"){
//         var sign = (parseInt(moment(date).format("DD")) <= 21) ? "Gemini" : "Cancer";
//     } elseif (moment(date).format("MM") === "07"){
//         var sign = (parseInt(moment(date).format("DD")) <= 22) ? "Cancer" : "Leo";
//     } elseif (moment(date).format("MM") === "08"){
//         var sign = (parseInt(moment(date).format("DD")) <= 22) ? "Leo" : "Virgo";
//     } elseif (moment(date).format("MM") === "09"){
//         var sign = (parseInt(moment(date).format("DD")) <= 23) ? "Virgo" : "Libra";
//     } elseif (moment(date).format("MM") === "10"){
//         var sign = (parseInt(moment(date).format("DD")) <= 23) ? "Libra" : "Scorpius";
//     } elseif (moment(date).format("MM") === "11"){
//         var sign = (parseInt(moment(date).format("DD")) <= 22) ? "Scorpius" : "Sagittarius";
//     } else {
//         var sign = (parseInt(moment(date).format("DD")) <= 21) ? "Sagittarius" : "Capricorn";
//     }
//     return sign;
// }

// module.exports = {
//     horoscope : horoscope,
// }
