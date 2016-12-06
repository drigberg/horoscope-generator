var grammar                       = require("./grammar.json");
var sentenceBigrams               = require("./sentenceBigrams.json");
var sentenceTypes                 = require("./sentenceTypes.json");
var Horoscope                     = require("../js/Horoscope.js").Horoscope;
var helpers                       = require("../../test/helpers");
var calendar                      = require("./calendar.json");


var horoscope = new Horoscope();

horoscope.calendar = calendar;
horoscope.grammar = grammar;
horoscope.sentenceBigrams = sentenceBigrams;
horoscope.sentenceTypes = sentenceTypes;
horoscope.userData = helpers.validForm;
horoscope.userData.sign = horoscope.evaluateSign(horoscope.userData.birthday);
horoscope.addUserDataToGrammar();

// for (var i = 0; i < 10; i++){
//     horoscope.paragraph = "";
//     var paragraph = horoscope.generateParagraph();
//     console.log("\n" + paragraph + "\n")
// }

var sentence_types_list = [];
for (var i = 0; i < Object.keys(sentenceTypes).length; i++) {
    sentence_types_list.push(Object.keys(sentenceTypes)[i]);
};

firstSentence = sentence_types_list[Math.floor(Math.random() * sentence_types_list.length)]
horoscope.structure.push(firstSentence);


var rand = Math.random();
var probSum = 0;
for (var n = 0; n < Object.keys(horoscope.sentenceBigrams[firstSentence]).length; n++) {
    var key = Object.keys(horoscope.sentenceBigrams[firstSentence])[n]
    probSum += horoscope.sentenceBigrams[firstSentence][key]
    if (rand < probSum){
        horoscope.structure.push(key);
        break
    }
}
console.log("\n" + horoscope.structure);

for (var n = 0; n < horoscope.structure.length; n ++) {
    currentSentenceType = horoscope.structure[n];
    horoscope.currentStructureIndex = n;
    if (currentSentenceType in horoscope.sentenceTypes) {
        if (horoscope.paragraph != "") {
            horoscope.paragraph += " "
        }
        var new_sentence = horoscope.cleanSentence(horoscope.generateSentence(horoscope.structure[n]));
        horoscope.paragraph += new_sentence;
    }
}

console.log("\n" + horoscope.paragraph + "\n");
