var horoscope = {};
var grammar = {};
var calendar = {};
var sentenceTypes = {};
var sentenceBigramProbabilities = {};
var signPaths = {};
var loadingAPI = new HoroscopeAPI();

$(document).ready(function() {
    if ($('li').length > $('li:visible').length) {
        $("#showMore").show();
    } else {
        $("#showMore").hide()
    }
    loadingAPI.loadCalendar();
    loadingAPI.loadGrammar();
    loadingAPI.loadSentenceTypes();
    loadingAPI.loadSentenceBigramProbabilities();
    loadingAPI.loadSignPaths();
});

$("#generate").click(function() {
    horoscope = new Horoscope();
    horoscope.calendar = loadingAPI.calendar;
    horoscope.grammar = loadingAPI.grammar;
    horoscope.sentenceTypes = loadingAPI.sentenceTypes;
    horoscope.sentenceBigramProbabilities = loadingAPI.sentenceBigramProbabilities;
    horoscope.signPaths = loadingAPI.signPaths;
    horoscope.userData.name = $("#userName").val();
    horoscope.userData.hometown = $("#hometown").val();
    horoscope.userData.birthday = $("#birthday").val();
    var error = horoscope.processHoroscopeForm();
    console.log(horoscope.paragraph);
    // if (error){
    //     $("#error-message").html(error);
    // } else {
    //     $.ajax({
    //         type: 'POST',
    //         url:  "/horoscopes",
    //         data:  {
    //             full_text       : horoscope.paragraph,
    //             abridged_text   : horoscope.sentence.cleanedContent,
    //             name            : horoscope.userData["name"],
    //             hometown        : horoscope.userData["hometown"],
    //             image           : horoscope.signPaths[horoscope.userData["sign"]]["path"],
    //             date            : horoscope.date,
    //             sign            : horoscope.userData["sign"],
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             if (data.redirect){
    //                 window.location.href = data.redirect;
    //             };
    //         }
    //     });
    // }
});

$("#showMore").click(function () {
    $('li:hidden').slice(0, 10).show();
    if ($('li').length == $('li:visible').length) {
        $("#showMore").fadeOut(2000);
    }
});
