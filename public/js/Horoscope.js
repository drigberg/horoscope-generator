var module = module || false;

if (module) {
    var _ = require("underscore");
    var moment = require("moment");
}

var Horoscope = function(args){
    that = this;
    //takes in form and grammar data to generate contextually sensible horoscope
    args || (args = {});
    _.extend(this,args);
    this.signPath = "";
    this.grammar = {};
    this.sentenceBigrams = {};
    this.sentenceTypes = {};
    this.calendar = {};
    this.userData = {
        "name" : "",
        "hometown" : "",
        "birthday" : "",
        "sign" : ""
    };
    this.date = "";
    this.sentence = {
        complete: false,
        content: [],
        tags: {},
        possibleConversions : [],
        testForAgreement : true,
        newText : "",
        cleanedContent : ""
    };
    this.structure = [];
    this.paragraph = "";
    this.addUserDataToGrammar = function(){
        //imports form info to horoscope object
        //finds user's sign, initializes sentence
        //adds name to grammar
        this.date = moment().format("MMMM Do YYYY, h:mm a");
        this.userData.sign = this.evaluateSign(this.userData.birthday);
        this.grammar["@NounSingular"]["@Sign"] = {
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
        while (this.structure[this.structure.length - 1] in this.sentenceBigrams) {
            var lastItem = this.structure[this.structure.length - 1];
            var rand = Math.random();
            var probSum = 0;
            for (var n = 0; n < Object.keys(this.sentenceBigrams[lastItem]).length; n++) {
                var key = Object.keys(this.sentenceBigrams[lastItem])[n]
                probSum += this.sentenceBigrams[lastItem][key]
                if (rand < probSum){
                    this.structure.push(key);
                    break
                }
            }
        }
        for (var n = 0; n < this.structure.length - 1; n ++) {
            currentSentenceType = this.structure[n];
            if (currentSentenceType in this.sentenceTypes) {
                if (this.paragraph != "") {
                    this.paragraph += " "
                }
                var new_sentence = this.cleanSentence(this.generateSentence(this.structure[n]));
                this.paragraph += new_sentence;
            }
        }
        return this.paragraph;
    };
    this.generateSentence = function(sentenceType){
        this.sentence.content = ["@ROOT"];
        this.sentence.complete = false;
        this.sentence.tags = this.sentenceTypes[sentenceType];
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
                        //this error needs to be louder
                        return "Evaluated a terminal!"
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
                    if (this.sentence.content[i] == "a" && "aeiou".indexOf(this.sentence.content[i+1][0].toLowerCase()) != -1){
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
                var first_in_month = this.calendar[moment(date).format("MMM")]["first"];
                var second_in_month = this.calendar[moment(date).format("MMM")]["second"];
                var split = this.calendar[moment(date).format("MMM")]["divide"];
                var sign = (parseInt(moment(date).format("DD")) <= split ? first_in_month : second_in_month);
            }
        }
        return sign;
    };

    //takes in form data, validates, generates horoscope, and pushes to database
    this.processHoroscopeForm = function(){
        var formValidation = this.validation.validateForm()
        if (formValidation){
            this.addUserDataToGrammar();
            this.generateParagraph();
            this.signPath = this.signPaths[this.userData["sign"]]["path"]
        } else {
            return "Please fill out all fields!"
        }
    };
    //functions for testing
    this.validation = {
        nameIsValid : function(){
            if (that.userData.name !== "") {
                return true;
            }
        },
        hometownIsValid : function(){
            if (that.userData.hometown !== "") {
                return true;
            }
        },
        birthdayIsValid : function(){
            if (that.userData.birthday !== "") {
                return true;
            }
        },
        validateForm : function(){
            if (this.nameIsValid() && this.birthdayIsValid() && this.hometownIsValid()){
                return true;
            }
        }
    };
};

var HoroscopeAPI = function(){
    var that = this;
    this.loadAllJsonData = function(){
        this.loadCalendar();
        this.loadGrammar();
        this.loadSentenceTypes();
        this.loadSentenceBigrams();
        this.loadSignPaths();
    },
    this.loadGrammar = function(){
        $.ajax({
            url: "/json/grammar.json",
            dataType: "json",
            success: function(data) {
                that.grammar = data;
            },
            failure: function() {
                console.log("Failed to load grammar!");
            }
        });
    };
    this.loadSentenceTypes = function(){
      $.ajax({
          url: "/json/sentenceTypes.json",
          dataType: "json",
          success: function(data) {
              that.sentenceTypes = data;
          }
      });
    };
    this.loadSentenceBigrams = function(){
      $.ajax({
          url: "/json/sentenceBigrams.json",
          dataType: "json",
          success: function(data) {
              that.sentenceBigrams = data;
          }
      });
    };
    this.loadCalendar = function(){
        $.ajax({
            url: "/json/calendar.json",
            dataType: "json",
            success: function(data) {
                that.calendar = data;
            }
        });
    };
    this.loadSignPaths = function(){
        $.ajax({
            url: "/json/signImages.json",
            dataType: "json",
            success: function(data) {
                that.signPaths = data;
            }
        });
    };
}

module.exports = {
    Horoscope : Horoscope
}
