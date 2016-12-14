var assert                        = require('assert');
var helpers                       = require('./helpers');
var calendar                      = require('../public/json/calendar.json');
var grammar                       = require('../public/json/grammar.json');
var sentenceBigramProbabilities   = require('../public/json/sentenceBigrams.json');
var sentenceTypes                 = require('../public/json/sentenceTypes.json');
var horoscope                     = require('../public/js/Horoscope.js');

// set up validation functions
var Horoscope = horoscope.Horoscope;

describe('Horoscope form requirements', function() {
    describe('Form valid if...', function() {
        it('all validators successful', function() {
            var validForm = new Horoscope();
            validForm.userData = helpers.validForm;
            assert(validForm.validation.validateForm(), 'At least one validator unsuccessful');
        });
    });

    describe('Form invalid if...', function() {
        it('hometown is blank', function() {
            var invalidForm = new Horoscope();
            assert(!invalidForm.validation.hometownIsValid())
        });
        it('name is blank', function() {
            var invalidForm = new Horoscope();
            assert(!invalidForm.validation.nameIsValid());
        });
        it('birthday is incomplete', function() {
            var invalidForm = new Horoscope();
            assert(!invalidForm.validation.birthdayIsValid());
        });
    });
});

describe('Sign Evaluation', function() {
    describe('Evaluation correct if...', function() {
        it('All months split correctly', function() {
            var allCorrect = true;
            for (i = 0; i < helpers.correctSigns.length; i++) {
                var date = '2000-' + Object.keys(helpers.correctSigns[i])[0];
                var user = new Horoscope();
                user.userData.birthday = date;
                user.calendar = calendar;
                if (user.evaluateSign(user.userData.birthday) != helpers.correctSigns[i][Object.keys(helpers.correctSigns[i])[0]]) {
                    allCorrect = false;
                }
            }
            assert(allCorrect, 'Sign mismatch');
        });
    });

    describe('Evaluation incorrect if...', function() {
        it('Months split noninclusively along divide', function() {
            var allIncorrect = true;
            for (i = 0; i < helpers.incorrectSigns.length; i++) {
                var date = '2000-' + Object.keys(helpers.incorrectSigns[i])[0];
                var user = new Horoscope( {userData :  {birthday : date}, calendar : calendar});
                if (user.evaluateSign(user.userData.birthday) == helpers.incorrectSigns[i][Object.keys(helpers.incorrectSigns[i])[0]]) {
                    allIncorrect = false;
                }
            }
            assert(allIncorrect, 'Splits inclusively along divide within months');
        });
    });
});

describe('Sentences', function() {
    describe('Sentence valid if...', function() {
        validSentence = new Horoscope( {
            sentenceContainsOnlyTerminals: function(sentence) {
                for (var n = 0; n < sentence.content.length; n++) {
                    if (sentence.content[n].indexOf('@') > -1) {
                        return false;
                    }
                }
                return true;
            }
        });

        validSentence.calendar = calendar;
        validSentence.grammar = grammar;
        validSentence.sentenceTypes = sentenceTypes;
        validSentence.userData = helpers.validForm;
        validSentence.userData.sign = validSentence.evaluateSign(validSentence.userData.birthday);
        validSentence.addUserDataToGrammar();

        var sentenceTypesList = [];
        for (var i = 0; i < Object.keys(sentenceTypes).length; i++)  {
            sentenceTypesList.push(Object.keys(sentenceTypes)[i]);
        };

        var allValid = true;
        for (var n = 0; n < 10000; n++) {
            sentenceType = sentenceTypesList[Math.floor(Math.random() * sentenceTypesList.length)]
            newSentence = validSentence.generateSentence(sentenceType);
            if (!(validSentence.sentenceContainsOnlyTerminals(newSentence))) {
                allValid = false;
                break;
            };
        }

        it('it contains only terminals', function() {
            assert(allValid, 'Generator can output nonterminals');
        });
    });
});

describe('Paragraphs', function() {
    describe('Structure valid if...', function() {
        correctStructure = new Horoscope( {
            structureContainsOnlyBigramElements: function() {
                for (var n = 0; n < that.structure.length - 1; n++)  {
                    if (!(horoscope.structure[n] in horoscope.sentenceBigramProbabilities || horoscope.structure[n] == '@END') && (horoscope.structure[n + 1] in horoscope.sentenceBigramProbabilities || horoscope.structure[n + 1] == '@END')) {
                        return false;
                    }
                }
                return true;
            },
            structureContainsOnlyNonzeroBigrams: function() {
                if (this.structureContainsOnlyBigramElements()) {
                    for (var n = 0; n < that.structure.length - 1; n++) {
                        if (that.sentenceBigramProbabilities[that.structure[n]][that.structure[n+1]] == 0)  {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }
        });
        correctStructure.structure = helpers.correctStructure;
        it('it begins with @START', function() {
            assert(correctStructure.structure.indexOf('@START') == 0, 'structure does not begin with @START');
        });
        it('it ends with @END', function() {
            assert(correctStructure.structure.indexOf('@END') == correctStructure.structure.length - 1, 'structure does not end with @END');
        });
        it('it only contains elements from the bigram probabilities', function() {
            assert(correctStructure.structureContainsOnlyBigramElements(), 'structure contains foreign elements');
        });
        it('it only contains nonzero bigrams', function() {
            assert(correctStructure.structureContainsOnlyNonzeroBigrams(), 'structure contains zero-probability bigrams');
        });
    });
});
