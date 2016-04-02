var paragraph = document.querySelector("p");
var populateButton = document.querySelector("#populate");
var sentenceDisplay = document.getElementById("sentence");
var generateButton = document.getElementById("generate");

var tree = {};
var sentence = ["ROOT"];
var sentenceComplete = "TRUE";
var output = "";
var add = "";
var rawData = "";
var lines = []
var linesList = [];
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

loadFile()

function populateTree(){
    if(rawData){
        linesList = [];
        tree = {};
        lines = rawData.split('\n');
        lines.forEach(prune);
        // linesList = linesList.map(function(string){
        //     if (String(string).charCodeAt(string.length-1) === 13){
        //         return string.substring(0, string.length - 1);                
        //     } else {
        //         return string;
        //     }
        // });
        linesList.forEach(addToTree);
        console.log("****** LINESLIST ******");
        console.log(linesList);
        console.log("****** TREE ******");
        console.log(tree);

    } else {
        console.log("no data to parse");
    }
}

function loadFile() {
    reader.open('get', "grammar/generic_grammar.txt", true); 
    reader.onreadystatechange = displayContents;
    reader.send(null);
}

function displayContents() {
    if(reader.readyState==4) {
        rawData = reader.responseText;
        console.log(rawData);
        populateTree();
    }
}

function prune(string){
    if (string[0] !== "#"){
        linesList.push(string.split(" "));
    }
}

function addToTree(array){
    if(typeof tree[array[1]] === "undefined"){
        tree[array[1]] = {}
    }
    var output = ""
    for (var i = 2; i < array.length; i++){
        if (i == 2) {
            output = array[i];
        } else {
            output = output + " " + array[i];
        }
    }
    tree[array[1]][output] = array[0];
}

function generateSentence(){
    //initialize sentence
    sentence = ["ROOT"];
    sentenceComplete = "FALSE";
    var debug = 0;
    //convert nonterminals until only terminals are left
    while (sentenceComplete == "FALSE"){
        debug += 1;
        sentenceComplete = "TRUE";
        console.log("Current sentence is: " + sentence);
        //loop through every word in the sentence
        for (var index = 0; index < sentence.length; index++){
            //removes carriage returns--move this!!!
            if (sentence[index].charCodeAt(sentence[index].length-1) === 13){
                sentence[index] = sentence[index].substring(0, sentence[index].length - 1);
            } 
            //only evaluate nonterminals
            if (sentence[index] in tree){
                var followingList = [];
                var convertedTextList = [];
                sentenceComplete = "FALSE";
                //find all possible conversions and add to list according to relative frequency 
                for (following in tree[sentence[index]]){
                    for (var freq = 0; freq < tree[sentence[index]][following]; freq++){
                        followingList.push(following);
                    }
                }
                //select conversion randomly
                var convertedText = followingList[Math.floor(Math.random()*followingList.length)];
                if(convertedText){
                    convertedText = convertedText.split(" ");
                    //replace nonterminal with new list of words
                    for (var i = 0; i < convertedText.length; i++){
                        if (i == 0){
                            sentence[index] = convertedText[i];
                        } else {
                            sentence.splice((index + i), 0, convertedText[i]);
                        }
                    }
                } else {
                    console.log("I accidentally evaluated a terminal!!!");
                }
            } else {
            }
        }
    }  
    console.log("done!!! sentence is: " + sentence);
}

function cleanSentence(){
    var cleanedSentence = ""
    for (i = 0; i < sentence.length; i++){
        if (i == 0){
            cleanedSentence = sentence[i];
        } else if (i == sentence.length - 1){
            cleanedSentence += sentence[i];
        } else {
            cleanedSentence += (" " + sentence[i]);
        }
    };
    cleanedSentence = cleanedSentence.charAt(0).toUpperCase() + cleanedSentence.slice(1);
    return cleanedSentence;
};

generateButton.addEventListener("click", function(){
    generateSentence();
    sentenceDisplay.innerHTML = cleanSentence();
})





// function loadFileAsText()
// {
//     var fileToLoad = document.getElementById("fileToLoad").files[0];
//     var fileReader = new FileReader();
//     fileReader.onload = function(fileLoadedEvent){
//         var textFromFileLoaded = fileLoadedEvent.target.result;
//         rawData = textFromFileLoaded;

//     };
//     fileReader.readAsText(fileToLoad, "UTF-8");
// }






