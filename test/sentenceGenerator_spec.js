var assert = require("assert");
var sentenceGenerator = require("../public/js/sentenceGenerator.js");
var helpers = require("./helpers");

describe("Horoscope form requirements", function(){
  var horoscope = sentenceGenerator.Horoscope;
  before(function(){
    validForm = new horoscope({userData: helpers.validForm});
  });
  describe("Form valid if...", function(){
    it("all validators successful", function(){
      assert(validForm.validateForm(), "Not valid");
    });
  });
  describe("Form invalid if...", function(){
    it("hometown is blank", function(){
      var form = new horoscope({userData : {hometown: ""}});
      assert(!form.hometownIsValid())
    });
    it("name is blank", function () {
      var form = new horoscope({userData : {name : ""}});
      assert(!form.nameIsValid());
    });
    it("birthday is incomplete", function () {
      var form = new horoscope({userData : {birthday : ""}});
      assert(!form.birthdayIsValid());
    });
  });
});
