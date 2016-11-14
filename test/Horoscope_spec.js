var assert = require("assert");
var helpers = require("./helpers");
var calendar = require("../public/json/calendar.json");
var Horoscope = require("../public/js/Horoscope.js");

describe("Horoscope form requirements", function(){
    var horoscope = Horoscope.Horoscope;
    console.log(horoscope);
    before(function(){
        validForm = new horoscope({userData: helpers.validForm});
    });
    describe("Form valid if...", function(){
        it("all validators successful", function(){
            assert(validForm.testing.validateForm(), "Not valid");
        });
    });
    describe("Form invalid if...", function(){
        it("hometown is blank", function(){
            var invalidForm = new horoscope({userData : {hometown: ""}});
            assert(!invalidForm.testing.hometownIsValid())
        });
        it("name is blank", function () {
            var invalidForm = new horoscope({userData : {name : ""}});
            assert(!invalidForm.testing.nameIsValid());
        });
        it("birthday is incomplete", function () {
            var invalidForm = new horoscope({userData : {birthday : ""}});
            assert(!invalidForm.testing.birthdayIsValid());
        });
    });
});

describe("Sign Evaluation", function(){
    var horoscope = Horoscope.Horoscope;
    describe("Evaluation correct if...", function(){
        it("All months split correctly", function(){
            var all_correct = true;
            for (i = 0; i < helpers.correctSigns.length; i++){
                var date = "2000-" + Object.keys(helpers.correctSigns[i])[0];
                var user = new horoscope({userData : {birthday : date}, calendar : calendar});
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
