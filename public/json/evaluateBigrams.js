var grammar                       = require("./grammar.json");
var sentenceBigrams               = require("./sentenceBigrams.json");
var sentenceTypes                 = require("./sentenceTypes.json");
var Horoscope                     = require("../js/Horoscope.js").Horoscope;
var helpers                       = require("../../test/helpers");
var calendar                      = require("./calendar.json");
var readline                      = require('readline');
var jsonfile                      = require('jsonfile')

var bigramsFile                   = "./sentenceBigrams.json";


var horoscope;

function resetHoroscope(){
    horoscope = new Horoscope();
    horoscope.calendar = calendar;
    horoscope.grammar = grammar;
    horoscope.sentenceTypes = sentenceTypes;
    horoscope.userData = helpers.validForm;
    horoscope.userData.sign = horoscope.evaluateSign(horoscope.userData.birthday);
    horoscope.addUserDataToGrammar();
}

bigrams = sentenceBigrams;

//push sentence types to list
var sentence_types_list = [];
for (var i = 0; i < Object.keys(sentenceTypes).length; i++) {
    sentence_types_list.push(Object.keys(sentenceTypes)[i]);
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

query();

function generatePair(){
    //choose random first sentence
    resetHoroscope();
    horoscope.structure = [];
    horoscope.paragraph = [];
    firstSentence = sentence_types_list[Math.floor(Math.random() * sentence_types_list.length)]
    horoscope.structure.push(firstSentence);

    //choose following sentence based on bigram probabilities
    var rand = Math.random();
    var probSum = 0;
    for (var n = 0; n < Object.keys(bigrams[firstSentence]).length; n++) {
        var key = Object.keys(bigrams[firstSentence])[n]
        probSum += bigrams[firstSentence][key]
        if (rand < probSum){
            horoscope.structure.push(key);
            break
        }
    }

    //generate and clean sentences
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
    console.log("\n" + horoscope.structure);
    console.log("\n\t" + horoscope.paragraph + "\n");
}


function query(){
    generatePair();

    rl.question('Do you like it? Or quit and save? (y/n/quit) ', function(answer){
        if (answer == "quit"){
            rl.close();
            writeBigrams();
        } else {
            adjust(answer);
            rl.pause();
            query();
        };
    });
};

function adjust(answer){
    switch (answer){
          case "y":
              var original = (bigrams[horoscope.structure[0]][horoscope.structure[1]]);
              bigrams[horoscope.structure[0]][horoscope.structure[1]] *= 1.2
              console.log(horoscope.structure[0] + " - " + horoscope.structure[1] + ": \n\t"+ original  + " ===> " + bigrams[horoscope.structure[0]][horoscope.structure[1]]);
              cleanAfterChange();
              break
          case "n":
              var original = (bigrams[horoscope.structure[0]][horoscope.structure[1]]);
              bigrams[horoscope.structure[0]][horoscope.structure[1]] *= 0.8
              console.log(horoscope.structure[0] + " - " + horoscope.structure[1] + ": \n\t"+ original  + " ===> " + bigrams[horoscope.structure[0]][horoscope.structure[1]]);
              cleanAfterChange();
              break
          case "meh":
              console.log("Meh? Meh!")
              break
    };
};

function cleanAfterChange(){
    var prob_total = 0
    var nonzero_count = 0

    for (var i = 0; i < Object.keys(bigrams[horoscope.structure[0]]).length; i++){
        if (bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]]){
            prob_total += bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]];
            nonzero_count += 1;
        }
    };

    console.log("\t********* discrepancy: " + (Math.round((prob_total - 1) * 100) / 100));
    console.log("\t********* scaling probabilities...");
    for (var i = 0; i < Object.keys(bigrams[horoscope.structure[0]]).length; i++){
        if (bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]]){
            bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]] /= prob_total;
        };
    };

    prob_total = 0

    for (var i = 0; i < Object.keys(bigrams[horoscope.structure[0]]).length; i++){
        if (bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]]){
            prob_total += bigrams[horoscope.structure[0]][Object.keys(bigrams[horoscope.structure[0]])[i]];
        }
    };

    console.log("\tTotal probability: " + prob_total + "\n")
}

function writeBigrams(){
    console.log("Writing to file....")
    jsonfile.writeFile(bigramsFile, bigrams, function (err) {
      console.error(err)
    })
    console.log("....Done!");
};
