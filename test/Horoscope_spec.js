var assert = require("assert");
var helpers = require("./helpers");
// var jsdom = require('./jsdom.js');

var Horoscope = require("../public/js/Horoscope.js");

// describe('jquery', function () {
//     var $
//     jsdom()
//     before(function () {
//       $ = require('jquery')
//     })
//
//     it('creating elements works', function () {
//       var div = $('<div>hello <b>world</b></div>')
//       expect(div.html()).to.eql('hello <b>world</b>')
//     })
//
//     it('lookup works', function () {
//       document.body.innerHTML = '<div>hola</div>'
//       expect($('div').html()).eql('hola')
//     })
// })

console.log(Horoscope);

describe("Horoscope form requirements", function(){
    var horoscope = Horoscope.Horoscope;
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
