var horoscope = {};
var grammar = {};
var calendar = {};
var sentenceTypes = {};
var sentenceBigramProbabilities = {};
var signPaths = {};
var loadingAPI = new HoroscopeAPI();
var socket = io.connect('http://localhost');

$(document).ready(function() {
    loadingAPI.loadAllJsonData();
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
    if (error){
        $("#error-message").html(error);
    } else {
        socket.emit('new_horoscope', horoscope);
        // $.ajax({
        //     type: 'POST',
        //     url:  "/horoscopes",
        //     data:  {
        //         full_text       : horoscope.paragraph,
        //         abridged_text   : horoscope.sentence.cleanedContent,
        //         name            : horoscope.userData["name"],
        //         hometown        : horoscope.userData["hometown"],
        //         image           : horoscope.signPaths[horoscope.userData["sign"]]["path"],
        //         date            : horoscope.date,
        //         sign            : horoscope.userData["sign"],
        //     },
        //     dataType: 'json',
        //     success: function(data){
        //         socket.emit('new_horoscope', data);
        //         if (data.redirect){
        //             window.location.href = data.redirect;
        //         };
        //     }
        // });
    }
});

var socket_data = 0
socket.on('new_horoscope', function (data) {
    console.log(data);
    socket_data = data;
    var newHoroscope = $(document.createElement('li'))
    //add elements with correct classes
    newHoroscope.append(document.createTextNode(data.horoscope.sentence.cleanedContent));
    // newHoroscope.append(document.createTextNode('HEYO'));
    // newHoroscope.append(document.createTextNode('HEYO'));

    var leader = $("#leaderboard-list").children()[0];
    newHoroscope.insertBefore(leader);
});
