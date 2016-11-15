var assert                        = require("assert");
var helpers                       = require("./helpers");
var calendar                      = require("../public/json/calendar.json");
var grammar                       = require("../public/json/grammar.json");
var sentenceBigramProbabilities   = require("../public/json/sentenceBigramProbabilities.json");
var sentenceTypes                 = require("../public/json/sentenceTypes.json");
var Horoscope                     = require("../public/js/Horoscope.js");

var horoscope = Horoscope.Horoscope;

describe("Horoscope form requirements", function(){
    describe("Form valid if...", function(){
        it("all validators successful", function(){
            var validForm = new horoscope();
            validForm.userData = helpers.validForm;
            assert(validForm.testing.validateForm(), "At least one validator unsuccessful");
        });
    });

    describe("Form invalid if...", function(){
        it("hometown is blank", function(){
            var invalidForm = new horoscope();
            assert(!invalidForm.testing.hometownIsValid())
        });

        it("name is blank", function () {
            var invalidForm = new horoscope();
            assert(!invalidForm.testing.nameIsValid());
        });

        it("birthday is incomplete", function () {
            var invalidForm = new horoscope();
            assert(!invalidForm.testing.birthdayIsValid());
        });
    });
});

describe("Sign Evaluation", function(){
    describe("Evaluation correct if...", function(){
        it("All months split correctly", function(){
            var all_correct = true;
            for (i = 0; i < helpers.correctSigns.length; i++){
                var date = "2000-" + Object.keys(helpers.correctSigns[i])[0];
                var user = new horoscope();
                user.userData.birthday = date;
                user.calendar = calendar;
                if (user.evaluateSign(user.userData.birthday) != helpers.correctSigns[i][Object.keys(helpers.correctSigns[i])[0]]){
                    all_correct = false;
                }
            }
            assert(all_correct, "Sign mismatch");
        });
    });

    describe("Evaluation incorrect if...", function(){
        it("Months split noninclusively along divide", function(){
            var all_incorrect = true;
            for (i = 0; i < helpers.incorrectSigns.length; i++){
                var date = "2000-" + Object.keys(helpers.incorrectSigns[i])[0];
                var user = new horoscope({userData : {birthday : date}, calendar : calendar});
                if (user.evaluateSign(user.userData.birthday) == helpers.incorrectSigns[i][Object.keys(helpers.incorrectSigns[i])[0]]){
                    all_incorrect = false;
                }
            }
            assert(all_incorrect, "Splits inclusively along divide within months");
        });
    });
});

describe("Paragraphs", function(){
    describe("Structure valid if...", function(){
        correctStructure = new horoscope();
        correctStructure.structure = helpers.correctStructure;

        it("Structure begins with @START", function(){
            assert(correctStructure.structure.indexOf("@START") == 0, "structure does not begin with @START");
        });

        it("Structure ends with @END", function(){
            assert(correctStructure.structure.indexOf("@END") == correctStructure.structure.length - 1, "structure does not end with @END");
        });
    });
});