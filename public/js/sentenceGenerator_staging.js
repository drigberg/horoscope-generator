var sentenceDisplay = document.getElementById("sentence");
var generateButton = document.getElementById("generate");

var sentence = ["@ROOT"];

generateButton.addEventListener("click", function(){
    generateSentence();
    sentenceDisplay.innerHTML = cleanSentence();
})

function generateSentence(){
    sentence = ["@ROOT"];
    var active_grammar = grammars[Math.floor(Math.random()*grammars.length)]
    var sentenceComplete = false;
    //var tripwire = 0;
    //convert nonterminals until only terminals are left
    while (sentenceComplete == false){
        //tripwire += 1;
        sentenceComplete = false;
        console.log("Current sentence is: " + sentence);
        for (var index = 0; index < sentence.length; index++){
            if (sentence[index] in active_grammar){
                var followingList = [];
                var convertedTextList = [];
                sentenceComplete = true;
                for (following in active_grammar[sentence[index]]){
                    for (var freq = 0; freq < active_grammar[sentence[index]][following][weight]; freq++){
                        followingList.push(following);
                    }
                }
                var newText = followingList[Math.floor(Math.random()*followingList.length)];
                if(newText){
                    newText = newText.split(" ");
                    for (var i = 0; i < newText.length; i++){
                        if (i == 0){
                            sentence[index] = newText[i];
                        } else {
                            sentence.splice((index + i), 0, newText[i]);
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
    var cleanedSentence = ""
    if (sentence) {
        for (i = 0; i < sentence.length; i++){
            if (i == 0){
                cleanedSentence = sentence[i];
            } else {
                if (sentence[i] == "a" && sentence[i+1][0] in {"a":0,"e":0,"i":0,"o":0,"u":0, "A":0, "E":0, "I":0, "O":0, "U":0}){
                    sentence[i] = "an";
                }
                cleanedSentence += (" " + sentence[i]);
            }
        };
        cleanedSentence = cleanedSentence.charAt(0).toUpperCase() + cleanedSentence.slice(1) + "!";
        return cleanedSentence;
    };
};