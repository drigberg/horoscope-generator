var sentenceDisplay = document.getElementById("sentence");
var generateButton = document.getElementById("generate");

var sentence = {};    
var paragraph = [];


generateButton.addEventListener("click", function(){
    //generate list of sentences
    //for each sentence type, generate sentence and append to paragraph
    var active_grammar = grammars[Object.keys(grammars)[Math.floor(Math.random()*Object.keys(grammars).length)]]
    sentence = {
        "content" : ["@ROOT"],
        "complete" : false,
        "tags" : {}
    };  
    sentence.tags = sentence_types[Object.keys(sentence_types)[Math.floor(Math.random()*Object.keys(sentence_types).length)]];
    //display paragraph, with spaces between elements
    console.log(sentence.tags);
    generateSentence();
    sentenceDisplay.innerHTML = cleanSentence();

})

function generateSentence(){
    //var active_grammar = grammars[Object.keys(grammars)[Math.floor(Math.random()*Object.keys(grammars).length)]]
    var active_grammar = grammars["general_grammar"];
    sentence.complete = false;
    //var tripwire = 0;
    //convert nonterminals until only terminals are left
    while (sentence.complete == false){
        //tripwire += 1;
        sentence.complete = true;
        //console.log("Current sentence is: " + sentence.content);
        for (var index = 0; index < sentence.content.length; index++){
            if (sentence.content[index] in active_grammar){
                var followingList = [];
                var convertedTextList = [];
                sentence.complete = false;
                for (following in active_grammar[sentence.content[index]]){
                    var testForAgreement = true;
                    for (tag in sentence.tags) {
                        if (tag in active_grammar[sentence.content[index]][following]) {
                            if (active_grammar[sentence.content[index]][following][tag] !== sentence.tags[tag]) {
                                testForAgreement = false
                            }
                        }
                    }
                    for (var freq = 0; freq < active_grammar[sentence.content[index]][following]["weight"]; freq++){
                        followingList.push(following);
                    }                      }
                var newText = followingList[Math.floor(Math.random()*followingList.length)];
                if(newText){
                    newText = newText.split(" ");
                    for (var i = 0; i < newText.length; i++){
                        if (i == 0){
                            sentence.content[index] = newText[i];
                        } else {
                            sentence.content.splice((index + i), 0, newText[i]);
                        }
                    }
                } else {
                    console.log("I accidentally evaluated a terminal!!!");
                }
            } 
        }
    }  
}

function cleanSentence(){
    sentence.cleanedContent = ""
    if (sentence.content) {
        for (i = 0; i < sentence.content.length; i++){
            if (i == 0){
                sentence.cleanedContent = sentence.content[i];
            } else {
                if (sentence.content[i] == "a" && sentence.content[i+1][0] in {"a":0,"e":0,"i":0,"o":0,"u":0, "A":0, "E":0, "I":0, "O":0, "U":0}){
                    sentence.content[i] = "an";
                }
                sentence.cleanedContent += (" " + sentence.content[i]);
            }
        };
        sentence.cleanedContent = sentence.cleanedContent.charAt(0).toUpperCase() + sentence.cleanedContent.slice(1) + "!";
        return sentence.cleanedContent;
    };
};