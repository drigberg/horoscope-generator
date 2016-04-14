var sentence_types = {
	"secondPerson_signDeclaration" : {
		"object" : "sign",
		"voice" : "active",
		"tense" : "present",
		"person" : "second"
	} ,
	"signDeclaration_thirdPerson_" : {
		"object" : "sign" ,
		"voice" : "active" ,
		"tense" : "past" ,
		"person" : "third"
	} ,
	"badStatement_secondPerson" : {
		"good/bad" : "bad" ,
		"tense" : "present" ,
		"person" : "second",
		"object" : "role" ,
		"modified_object" : true
	} ,
	"badStatement_thirdPerson" : {
		"good/bad" : "bad" ,
		"tense" : "present" ,
		"person" : "third" ,
		"object" : "role" ,
		"modified_object" : true
	} 
}

var grammar = {
	"@ROOT" : {
		"@Subject @VerbPhrase"  : {
			"weight": 4
		}
	} ,
	"@VerbPhrase" : {
		"@Verb @Object" : {
			"weight": 4
		}
	} ,
	"@Object" : {
		// "@Object @PrepositionalPhrase" : {"weight": 1} ,
		"@ProperNoun" : {
			"weight": 7,
			"object" : "name"
		} ,
		"@Conjunction @Noun" : {
			"weight": 7 ,
			"modified_object" : false
		} ,
		"@Conjunction @Adjective @Noun" : {
			"weight" : 2 ,
			"modified_object" : true
		}
	} ,
	"@Verb" : {
		"are" : {
			"weight": 4,
			"tense" : "present",
			"voice" : "active",
			"person" : "second"
		} ,
		"were" : {
			"weight": 4,
			"tense" : "past",
			"voice" : "active",
			"person" : "second"			
		} ,
		"was" : {
			"weight": 4,
			"tense" : "past",
			"voice" : "active",
			"person" : "third"			
		} ,
		"is" : {
			"weight": 4,
			"tense" : "present",
			"voice" : "active",
			"person" : "third"			
		}
	} , 
	"@PrepositionalPhrase" : {
		"@Preposition @Object" : {"weight" : 4}
	} ,
	"@Subject" : {
		"you" : {
			"weight": 4,
			"person": "second"
		} ,
		"your mother" : {
			"weight": 4,
			"person": "third"
		} ,
		"your father" : {
			"weight": 4,
			"person": "third"
		}
	} ,
	"@Preposition" : {
		"in" : {"weight": 4},
		"with" : {"weight": 4},
		"thanks to" : {"weight": 4}
	} ,
	"@Noun" : {
		"star" : {
			"weight": 4,
			"object" : "thing"
		},
		"moose" : {
			"weight": 4,
			"object" : "thing"
		} ,
		"Aries" : {
			"weight" : 4,
			"object" : "sign"
		} ,
		"Gemini" : {
			"weight" : 4,
			"object" : "sign"
		} ,
		"athlete" : {
			"weight" : 4,
			"object" : "role"
		} ,
		"scientist" : {
			"weight" : 4,
			"object" : "role"
		} 
	} ,
	"@ProperNoun" : {
		"Master Commander" : {"weight": 4},
		"Lord Ruler" : {"weight": 4},
		"God" : {"weight": 4},
		"Joe" : {"weight": 4}
	} ,
	"@Conjunction" : {
		"a" : {
			"weight": 4
		}
	} ,
	"@Adjective" : {
		"wonderful" : {
			"weight" : 4,
			"good/bad" : "good"
		} ,
		"amazing" : {
			"weight" : 4,
			"good/bad" : "good"
		} ,
		"terrible" : {
			"weight" : 4,
			"good/bad" : "bad"
		} ,
		"horrible" : {
			"weight" : 4,
			"good/bad" : "bad"
		} 				
	}
}


