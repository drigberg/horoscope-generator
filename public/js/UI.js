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
        paragraph : "",
        loadGrammar : function(){
            var that = this;
            $.ajax({
                url: "/json/grammar.json",
                dataType: "json",
                success: function(data) {
                    that.grammar = data;
                }
            });
        },
        loadSentenceTypes : function(){
          var that = this;
          $.ajax({
              url: "/json/sentenceTypes.json",
              dataType: "json",
              success: function(data) {
                  that.sentenceTypes = data;
              }
          });
        },
        loadSentenceBigramProbabilities : function(){
          var that = this;
          $.ajax({
              url: "/json/sentenceBigramProbabilities.json",
              dataType: "json",
              success: function(data) {
                  that.sentenceBigramProbabilities = data;
              }
          });
        },
        loadCalendar : function(){
          var that = this;
            $.ajax({
                url: "/json/calendar.json",
                dataType: "json",
                success: function(data) {
                    that.calendar = data;
                }
            });
        },
        loadSignPaths : function(){
          var that = this;
            $.ajax({
                url: "/json/signImages.json",
                dataType: "json",
                success: function(data) {
                    that.signPaths = data;
                }
            });
        }
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
    var error = horoscope.processHoroscopeForm();
    if (error){
        $("#error-message").html(error);
    } else {
        $.ajax({
            type: 'POST',
            url:  "/horoscopes",
            data:  {
                full_text       : horoscope.paragraph,
                abridged_text   : horoscope.sentence.cleanedContent,
                name            : horoscope.userData["name"],
                hometown        : horoscope.userData["hometown"],
                image           : horoscope.signPaths[horoscope.userData["sign"]]["path"],
                date            : horoscope.date,
                sign            : horoscope.userData["sign"],
            },
            dataType: 'json',
            success: function(data){
                if (data.redirect){
                    window.location.href = data.redirect;
                };
            }
        });
    }

});

$("#showMore").click(function () {
    $('li:hidden').slice(0, 10).show();
    if ($('li').length == $('li:visible').length) {
        $("#showMore").fadeOut(2000);
    }
});
