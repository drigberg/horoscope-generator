var horoscope = {};

$(document).ready(function() {
    if ($('li').length > $('li:visible').length) {
        $("#showMore").show();
    } else {
        $("#showMore").hide()
    }
    horoscope = new Horoscope();
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
