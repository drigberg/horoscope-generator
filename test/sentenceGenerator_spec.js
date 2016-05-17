var assert = require("assert");
var helpers = require("./helpers");
var jsdom = require('./jsdom.js')

describe('jquery', function () {
    var $
    jsdom()
    before(function () {
      $ = require('jquery')
    })

    it('creating elements works', function () {
      var div = $('<div>hello <b>world</b></div>')
      expect(div.html()).to.eql('hello <b>world</b>')
    })

    it('lookup works', function () {
      document.body.innerHTML = '<div>hola</div>'
      expect($('div').html()).eql('hola')
    })
})
var sentenceGenerator = require("../public/js/sentenceGenerator.js");

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
