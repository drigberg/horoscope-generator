// var horoscope = require("./models/horoscope.js")

$(document).ready(function() {
    horoscope.loadGrammar();
    horoscope.loadCalendar();
    horoscope.loadSignPaths();
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
        //finds user's sign, initializes sentence
        //adds name to grammar
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
                "weight" : 50,
                "person" : "third" ,
                "name" : true
            };
            this.grammar["@Name"] = {};
            this.grammar["@Name"][this.userData["name"]] = {
                "weight" : 4
            };
        }
        this.userData.sign = this.evaluateSign(this.userData.birthday);
        this.grammar["@Noun"]["@Sign"] = {
            "weight" : 50 ,
            "object" : "sign"
        };
        this.grammar["@Sign"] = {};
        this.grammar["@Sign"][this.userData["sign"]] = {
            "weight" : 50 ,
            "object" : "sign"
        };
    };
    this.generateParagraph = function(){
        this.structure = ["@START"];
        //use bigrams to generate paragraph structure
        while (this.structure[this.structure.length - 1] != "@END") {
            var lastItem = this.structure[this.structure.length - 1];
            var rand = Math.random();
            var probSum = 0;
            for (var n = 0; n < Object.keys(this.sentenceBigramProbabilities[lastItem]).length; n++) {
                var key = Object.keys(this.sentenceBigramProbabilities[lastItem])[n]
                probSum += this.sentenceBigramProbabilities[lastItem][key]
                if (rand < probSum){
                    this.structure.push(key);
                    break
                }
            }
        }
        for (var n = 0; n < this.structure.length - 1; n ++) {
            currentSentenceType = this.structure[n];
            if (currentSentenceType in this.sentence_types) {
                if (this.paragraph != "") {
                    this.paragraph += " "
                }
                this.paragraph += this.cleanSentence(this.generateSentence(this.structure[n]));
            }
        }
        return this.paragraph;
    };
    this.generateSentence = function(sentenceType){
        this.sentence.content = ["@ROOT"];
        this.sentence.complete = false;
        this.sentence.tags = this.sentence_types[sentenceType];
        this.sentence.complete = false;
        //convert nonterminals until only terminals are left (nonterminals begin with @ symbol)
        while (this.sentence.complete == false){
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
        return this.sentence
    };
    this.cleanSentence = function(){
        //generates single string for sentence from list; handles punctuation, a vs. an, etc.
        this.sentence.cleanedContent = "";
        if (this.sentence.content) {
            for (i = 0; i < this.sentence.content.length; i++){
                if (i == 0){
                    this.sentence.cleanedContent = this.sentence.content[i];
                } else {
                    if (this.sentence.content[i] == "a" && this.sentence.content[i+1][0].toLowerCase() in {"a":0,"e":0,"i":0,"o":0,"u":0}){
                        this.sentence.content[i] = "an";
                    }
                    if (this.sentence.content[i] !== "," && this.sentence.content[i-1] !== ";"){
                        this.sentence.cleanedContent += (" " + this.sentence.content[i]);
                    } else {
                         this.sentence.cleanedContent += this.sentence.content[i];
                    }
                }
            };
            this.sentence.cleanedContent = this.sentence.cleanedContent.charAt(0).toUpperCase() + this.sentence.cleanedContent.slice(1) + "!";
        };
        return this.sentence.cleanedContent
    };
    this.evaluateSign = function(date){
        //finds appropriate sign according to signCalendar.json data
        if (moment(date).format() !== "Invalid date"){
            if (moment(date).format("MMM") in this.calendar) {
                let first_in_month = this.calendar[moment(date).format("MMM")]["first"];
                let second_in_month = this.calendar[moment(date).format("MMM")]["second"];
                let split = this.calendar[moment(date).format("MMM")]["divide"];
                var sign = (parseInt(moment(date).format("DD")) <= split ? first_in_month : second_in_month);
            }
        }
        return sign;
    };
    this.loadGrammar = function(){
        var that = this;
        $.ajax({
            url: "/json/grammars.json",
            dataType: "json",
            success: function(data) {
                that.grammar = data.grammar;
                that.sentence_types = data.sentence_types;
                that.sentenceBigramProbabilities = data.sentenceBigramProbabilities;
            }
        });
    };
    this.loadCalendar = function(){
        var that = this;
        $.ajax({
            url: "/json/calendar.json",
            dataType: "json",
            success: function(data) {
                that.calendar = data;
            }
        });
    };

    this.loadSignPaths = function(){
        var that = this;
        $.ajax({
            url: "/json/signImages.json",
            dataType: "json",
            success: function(data) {
                that.signImages = data;
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
        var that = this;
        var formValidation = this.validateForm()
        if (formValidation){
            async.series([
                this.initializeHoroscope(),
                this.generateParagraph(),
                $.ajax({
                    type: 'POST',
                    url:  "/horoscopes",
                    data:  {
                        full_text       : that.paragraph,
                        abridged_text   : that.sentence.cleanedContent,
                        name            : that.userData["name"],
                        hometown        : that.userData["hometown"],
                        image           : that.signImages[that.userData["sign"]]["path"],
                        date            : that.date,
                        sign            : that.userData["sign"],
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
    sentence : {
        complete: false,
        compound: false,
        content: [],
        tags: {},
        possibleConversions : [],
        testForAgreement : true,
        newText : "",
        cleanedContent : ""
    } ,
    structure : [],
    paragraph : ""
});

exports = {
    Horoscope : Horoscope,
}
