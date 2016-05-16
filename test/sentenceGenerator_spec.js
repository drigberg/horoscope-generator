var assert = require("assert");
var sentenceGenerator = require("../public/js/sentenceGenerator.js");
var helpers = require("./helpers");

describe("Horoscope form requirements", function(){
  var horoscope = sentenceGenerator.horoscope;
  before(function(){
    validForm = helpers.validForm;
  });
  describe("Form valid if...", function(){
    it("all validators successful", function(){
      assert(validApp.isValid(), "Not valid");
    });
  });
  describe("Form invalid if...", function(){
    it("hometown is blank", function(){
      var app = new MembershipApplication({hometown: "")});
      assert(!app.hometownIsValid())
    });
    it("name is blank", function () {
      var app = new MembershipApplication({name : ""});
      assert(!app.nameIsValid());
    });
    it("birthday is incomplete", function () {
      var app = new MembershipApplication({birthday : ""});
      assert(!app.birthdayIsValid());
    });
  });
});
