var horoscope = {};

$(document).ready(function() {
    if ($('li').length > $('li:visible').length) {
        $("#showMore").show();
    } else {
        $("#showMore").hide()
    }
    horoscope = new Horoscope({
        //inializes horoscope object
        sentence_types : {},
        grammar : {},
        sentenceBigramProbabilities : {},
        sentenceTypes : {},
        calendar : {},
        userData : {
            "name" : "",
            "hometown" : "",
            "birthday" : "",
            "sign" : ""
        },
        date: "",
        sentence : {
            complete: false,
            compound: false,
            content: [],
            tags: {},
            possibleConversions : [],
            testForAgreement : true,
            newText : "",
            cleanedContent : ""
        } ,
        structure : [],
        paragraph : ""
    });
    horoscope.loadCalendar();
    horoscope.loadGrammar();
    horoscope.loadSentenceTypes();
    horoscope.loadSentenceBigramProbabilities();
    horoscope.loadSignPaths();
});

$("#generate").click(function() {
    horoscope.userData.name = $("#userName").val();
    horoscope.userData.hometown = $("#hometown").val();
    horoscope.userData.birthday = $("#birthday").val();
    horoscope.processHoroscopeForm();
});

$("#showMore").click(function () {
    $('li:hidden').slice(0, 10).show();
    if ($('li').length == $('li:visible').length) {
        $("#showMore").fadeOut(2000);
    }
});
