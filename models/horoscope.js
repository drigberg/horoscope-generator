var horoscope = {
	sentence_types : {},
	grammar : {},
	username : "",
	sentence: {
		complete: false,
		content: [],
		tags: {},
		possibleConversions : [],
		testForAgreement : true,
		newText : "",
		cleanedContent : ""
	} ,
	tripwire : false
}

module.exports = horoscope;