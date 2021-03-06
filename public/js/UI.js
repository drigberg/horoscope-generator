var horoscope = {};
var grammar = {};
var calendar = {};
var sentenceTypes = {};
var sentenceBigrams = {};
var signPaths = {};
var loadingAPI = new HoroscopeAPI();
var socket = io.connect();


$(document).ready(function() {
    loadingAPI.loadAllJsonData();
});

$("#generate").click(function() {
    horoscope = new Horoscope();
    horoscope.calendar = loadingAPI.calendar;
    horoscope.grammar = loadingAPI.grammar;
    horoscope.sentenceTypes = loadingAPI.sentenceTypes;
    horoscope.sentenceBigrams = loadingAPI.sentenceBigrams;
    horoscope.signPaths = loadingAPI.signPaths;
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
                image           : horoscope.signPath,
                date            : horoscope.date,
                sign            : horoscope.userData["sign"],
            },
            dataType: 'json',
            success: function(data){
                socket.emit('new_horoscope', horoscope);
                if (data.redirect){
                    window.location.href = data.redirect;
                };
            }
        });
    }
});

var socket_data = 0
socket.on('new_horoscope', function (data) {
    var newHoroscope = $(document.createElement('li'));
    var newElements = [
        $("<h5 class='list-item-date'>" + data.horoscope.date + "</h5>"),
        $("<img class='list-icon' src=" + data.horoscope.signPath + ">"),
        $('<h4 class="list-text">'
            + data.horoscope.userData["name"]
            + ' from '
            + data.horoscope.userData["hometown"]
            + ' got "'
            + data.horoscope.sentence.cleanedContent
            + '"<h4>'
        )
    ];
    for (var i = 0; i < newElements.length; i++){
        newHoroscope.append(newElements[i]);
    }

    var leader = $("#leaderboard-list").children()[0];
    newHoroscope.insertBefore(leader);
});
