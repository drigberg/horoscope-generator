exports.validForm = {
    name : "Daniel",
    hometown : "Hershey",
    birthday : "1993-03-11"
};

exports.correctSigns = [
    {"01-01" : "Capricorn"},
    {"01-21" : "Aquarius"},
    {"02-01" : "Aquarius"},
    {"02-20" : "Pisces"},
    {"03-01" : "Pisces"},
    {"03-21" : "Aries"},
    {"04-01" : "Aries"},
    {"04-21" : "Taurus"},
    {"05-01" : "Taurus"},
    {"05-22" : "Gemini"},
    {"06-01" : "Gemini"},
    {"06-22" : "Cancer"},
    {"07-01" : "Cancer"},
    {"07-23" : "Leo"},
    {"08-01" : "Leo"},
    {"08-23" : "Virgo"},
    {"09-01" : "Virgo"},
    {"09-24" : "Libra"},
    {"10-01" : "Libra"},
    {"10-24" : "Scorpius"},
    {"11-01" : "Scorpius"},
    {"11-23" : "Sagittarius"},
    {"12-01" : "Sagittarius"},
    {"12-22" : "Capricorn"},
];

exports.incorrectSigns = [
    {"01-20" : "Aquarius"},
    {"02-19" : "Pisces"},
    {"03-20" : "Aries"},
    {"04-20" : "Taurus"},
    {"05-21" : "Gemini"},
    {"06-21" : "Cancer"},
    {"07-22" : "Leo"},
    {"08-22" : "Virgo"},
    {"09-23" : "Libra"},
    {"10-23" : "Scorpius"},
    {"11-22" : "Sagittarius"},
    {"12-21" : "Capricorn"}
];

exports.correctStructure = ["@START", "FILLER", "FILLER", "@END"];
