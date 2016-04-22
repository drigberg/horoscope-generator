var horoscope = new Object();

$.ajax({
    url: "/grammar/grammars.json",
    dataType: "json",
    success: function(data) {
        horoscope = data;
        console.log(horoscope);
    }
});

$(document).ready(function() {
    $("#content").css("opacity", 0.0);
});

$("#generate").click( function() {
    //generate list of sentences
    // for each sentence type, generate sentence and append to paragraph
    horoscope.userName = $("#userName").val();
    if (horoscope.userName !== ""){
        horoscope.sentence_types["name_signDeclaration"] = {
            "object" : "sign",
            "voice" : "active",
            "name" : true,
            "tense" : "present",
            "person" : "third" ,
            "verbtype" : "linking"
        };
        horoscope.grammar["@Subject"]["@Name"] = {
            "weight" : 50 ,
            "person" : "third" ,
            "name" : true           
        };
        horoscope.grammar["@Name"] = {};
        horoscope.grammar["@Name"][horoscope.userName] = {
            "weight" : 4
        };
    }
    horoscope.sentence = {
        "content" : ["@ROOT"],
        "complete" : false,
        "tags" : {}
    };  
    horoscope.sentence.tags = horoscope.sentence_types[Object.keys(horoscope.sentence_types)[Math.floor(Math.random()*Object.keys(horoscope.sentence_types).length)]];
    //display paragraph, with spaces between elements
    console.log(horoscope.sentence.tags);
    generateSentence();
    animateNewHoroscope();
});

function generateSentence(){
    //var active_grammar = grammars[Object.keys(grammars)[Math.floor(Math.random()*Object.keys(grammars).length)]]
    horoscope.sentence.complete = false;
    horoscope.tripwire = 0;
    //convert nonterminals until only terminals are left
    while (horoscope.sentence.complete == false){
    //while (tripwire < 12){
        //tripwire += 1;
        horoscope.sentence.complete = true;
        //console.log("Current sentence is: " + sentence.content);
        for (var index = 0; index < horoscope.sentence.content.length; index++){
            if (horoscope.sentence.content[index] in horoscope.grammar){
                horoscope.followingList = [];
                horoscope.convertedTextList = [];
                horoscope.sentence.complete = false;
                for (following in horoscope.grammar[horoscope.sentence.content[index]]){
                    horoscope.testForAgreement = true;
                    for (tag in horoscope.sentence.tags) {
                        if (tag in horoscope.grammar[horoscope.sentence.content[index]][following]) {
                            if (horoscope.grammar[horoscope.sentence.content[index]][following][tag] !== horoscope.sentence.tags[tag]) {
                                horoscope.testForAgreement = false;
                            }
                        }
                    }
                    if (horoscope.testForAgreement == true) {
                        for (var freq = 0; freq < horoscope.grammar[horoscope.sentence.content[index]][following]["weight"]; freq++){
                            horoscope.followingList.push(following);
                        } 
                    }                     
                }
                horoscope.newText = horoscope.followingList[Math.floor(Math.random()*horoscope.followingList.length)];
                if(horoscope.newText){
                    horoscope.newText = horoscope.newText.split(" ");
                    for (var i = 0; i < horoscope.newText.length; i++){
                        if (i == 0){
                            horoscope.sentence.content[index] = horoscope.newText[i];
                        } else {
                            horoscope.sentence.content.splice((index + i), 0, horoscope.newText[i]);
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
    horoscope.sentence.cleanedContent = "";
    if (horoscope.sentence.content) {
        for (i = 0; i < horoscope.sentence.content.length; i++){
            if (i == 0){
                horoscope.sentence.cleanedContent = horoscope.sentence.content[i];
            } else {
                if (horoscope.sentence.content[i] == "a" && horoscope.sentence.content[i+1][0] in {"a":0,"e":0,"i":0,"o":0,"u":0, "A":0, "E":0, "I":0, "O":0, "U":0}){
                    horoscope.sentence.content[i] = "an";
                }
                if (horoscope.sentence.content[i] !== "," && horoscope.sentence.content[i-1] !=- ";"){
                    horoscope.sentence.cleanedContent += (" " + horoscope.sentence.content[i]);
                } else {
                     horoscope.sentence.cleanedContent += horoscope.sentence.content[i];                   
                }
            }
        };
        horoscope.sentence.cleanedContent = horoscope.sentence.cleanedContent.charAt(0).toUpperCase() + horoscope.sentence.cleanedContent.slice(1) + "!";
        return horoscope.sentence.cleanedContent;
    };
};

$("#showButton").click(function(){
    $(".showToggle").fadeToggle(500);
})

function animateNewHoroscope(){
    if ($("#content").css("opacity") == 0.0) {
        $("#content").html(cleanSentence());
    } else {
        $("#content").animate({
            opacity: 0.0
        } , 500 , function(){
            $("#content").html(cleanSentence());
        });
    }
    $("#content").animate({
        opacity: 1.0
    });
}