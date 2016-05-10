// var horoscope = require("./models/horoscope.js")
var horoscope = {
    sentence_types : {},
    grammar : {},
    username : "",
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
    initializeHoroscope : function(data){
        this.userName = data["name"];
        if (this.userName !== ""){
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
            this.grammar["@Name"][this.userName] = {
                "weight" : 4
            };
        }
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
            //console.log("Current sentence is: " + sentence.content);
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
        console.log(this);
        console.log(this.sentence);
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
    animateNewHoroscope: function(){
        $("#generate").prop('disabled', true);
        console.log($("#generate").prop('disabled'));
        if ($("#content").css("opacity") == 0.0) {
            $("#content").html(horoscope.sentence.cleanedContent);
        } else {
            $("#content").animate({
                opacity: 0.0
            } , 200 , function(){
                $("#content").html(horoscope.sentence.cleanedContent);

            });
        }
        $("#content").animate({
            opacity: 1.0
        }, 200, function(){
                $("#generate").prop('disabled', false);
                console.log($("#generate").prop('disabled'));
        });
    }
}

$.ajax({
    url: "/grammar/grammars.json",
    dataType: "json",
    success: function(data) {
        horoscope.grammar = data.grammar;
        horoscope.sentence_types = data.sentence_types;
        console.log(horoscope);
    }
});

function processHoroscopeForm() {
    var userData = {
        "name" : $("#userName").val(),
        "hometown" : $("#hometown").val(),
        "birthday" : $("#birthday").val(),
    }

    async.series([
        horoscope.initializeHoroscope(userData),
        horoscope.generateSentence(),
        horoscope.cleanSentence(),
        horoscope.animateNewHoroscope(),
        $.ajax({
            type: 'POST',
            url:  "/",
            data:  {
                text : horoscope.sentence.cleanedContent,
                name : userData["name"],
                hometown : userData["hometown"],
                birthday : userData["birthday"]
            },
            dataType: 'json'
        })
    ]);
}

$(document).ready(function() {
    $("#content").css("opacity", 0.0);
});

$("#generate").click( function() {
    //generate list of sentences
    // for each sentence type, generate sentence and append to paragraph
    async.series([
        horoscope.initializeHoroscope(),
        horoscope.generateSentence(),
        horoscope.cleanSentence(),
        horoscope.animateNewHoroscope()
    ]);
});

$("#showButton").click(function(){
    $(".showToggle").fadeToggle(500);
})

// module.exports = {
//     horoscope : horoscope,

// }