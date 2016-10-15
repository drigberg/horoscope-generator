// var horoscope = require("./models/horoscope.js")

$(document).ready(function() {
    horoscope.loadGrammar();
    horoscope.loadCalendar();
    if ($('li').length > $('li:visible').length) {
        $("#showMore").show();
    } else {
        $("#showMore").hide()
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

var Horoscope = function(args){
    //takes in form and grammar data to generate contextually sensible horoscope
    args || (args = {});
    _.extend(this,args);
    this.initializeHoroscope = function(){
        //imports form info to horoscope object
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
        //finds user's sign, initializes sentence
        this.userData.sign = this.evaluateSign(horoscope.userData.birthday);
        this.sentence.content = ["@ROOT"];
        this.sentence.complete = false;
        this.sentence.tags = this.sentence_types[Object.keys(this.sentence_types)[Math.floor(Math.random()*Object.keys(this.sentence_types).length)]];
        //future edits: will loop through sentences and display paragraph
    };
    this.generateSentence = function(){
        //var active_grammar = grammars[Object.keys(grammars)[Math.floor(Math.random()*Object.keys(grammars).length)]]
        this.sentence.complete = false;
        // this.tripwire = 0;
        //convert nonterminals until only terminals are left (nonterminals begin with @ symbol)
        while (this.sentence.complete == false){
        //while (tripwire < 12){
            //tripwire += 1;
            this.sentence.complete = true;
            for (var index = 0; index < this.sentence.content.length; index++){
                if (this.sentence.content[index] in this.grammar){
                    this.sentence.possibleConversions = [];
                    this.sentence.complete = false;
                    for (following in this.grammar[this.sentence.content[index]]){
                        //check tags for voice, tense, person, and type agreement based on sentence type
                        this.sentence.testForAgreement = true;
                        for (tag in this.sentence.tags) {
                            if (tag in this.grammar[this.sentence.content[index]][following]) {
                                if (this.grammar[this.sentence.content[index]][following][tag] !== this.sentence.tags[tag]) {
                                    this.sentence.testForAgreement = false;
                                }
                            }
                        }
                        //selects approved options for random assignment to conversion from nonterminal
                        if (this.sentence.testForAgreement == true) {
                            for (var freq = 0; freq < this.grammar[this.sentence.content[index]][following]["weight"]; freq++){
                                this.sentence.possibleConversions.push(following);
                            }
                        }
                    }
                    //randomly chooses conversion for nonterminal out of weighted options
                    this.sentence.newText = this.sentence.possibleConversions[Math.floor(Math.random()*this.sentence.possibleConversions.length)];
                    //inserts individual words from nonterminal string into sentence list
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
    };
    this.cleanSentence = function(){
        //generates single string for sentence from list; handles punctuation, a vs. an, etc.
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
    };
    this.evaluateSign = function(date){
        //finds appropriate sign according to signCalendar.json data
        if (moment(date).format() !== "Invalid date"){
            if (moment(date).format("MMM") in horoscope.calendar) {
                var sign = (parseInt(moment(date).format("DD")) <= horoscope.calendar[moment(date).format("MMM")]["divide"]) ? horoscope.calendar[moment(date).format("MMM")]["first"] : horoscope.calendar[moment(date).format("MMM")]["second"]
            }
        }
        return sign;
    };
    this.loadGrammar = function(){
        $.ajax({
            url: "/json/grammars.json",
            dataType: "json",
            success: function(data) {
                horoscope.grammar = data.grammar;
                horoscope.sentence_types = data.sentence_types;
            }
        });
    };
    this.loadCalendar = function(){
        $.ajax({
            url: "/json/calendar.json",
            dataType: "json",
            success: function(data) {
                horoscope.calendar = data;
            }
        });
    };

    //form validation functions
    this.nameIsValid = function(){
        if (this.userData.name !== "") {
            return true;
        }
    };
    this.hometownIsValid = function(){
        if (this.userData.hometown !== "") {
            return true;
        }
    };
    this.birthdayIsValid = function(){
        if (this.userData.birthday !== "") {
            return true;
        }
    };
    this.validateForm = function(){
        if (this.nameIsValid() && this.birthdayIsValid() && this.hometownIsValid()){
            return true;
        }
    };

    //takes in form data, validates, generates horoscope, and pushes to database
    this.processHoroscopeForm = function(){
        this.userData.name = $("#userName").val();
        this.userData.hometown = $("#hometown").val();
        this.userData.birthday = $("#birthday").val();
        var formValidation = this.validateForm()
        if (formValidation){
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
      } else {
          $("#error-message").html("Please fill out all fields!");
      }
    };
};

var horoscope = new Horoscope({
    //inializes horoscope object
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
    tripwire : false
});

exports = {
    Horoscope : Horoscope,
}
