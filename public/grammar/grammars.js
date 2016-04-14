<<<<<<< HEAD

var grammar = {
	"@ROOT" : {
		"@Subject @VerbPhrase"  : {"weight": 4}
	} ,
	"@VerbPhrase" : {
		"@Verb @Object" : {"weight": 4}
	} ,
	"@Verb" : {
		"eaten" : {
			"weight": 4,
			"voice": "passive",
			"type": "bad_thing"
		} ,
		"destroyed" : {
			"weight": 4,
			"voice": "passive",
			"type": "bad_thing"
		} ,
		"destroy" : {
			"weight": 4,
			"voice": "active",
			"type": "bad_thing"
		} ,
		"subjugated" : {
			"weight": 4,
			"voice": "active",
			"type": "bad_thing"
		} ,
		"philosophically challenged" : {
			"weight": 4,
			"voice": "passive",
			"type": "bad_thing"
		} ,
		"granted diplomatic immunity" : {
			"weight": 4,
			"voice": "passive",
			"type": "good_thing"
		} ,
		"sacrificed" : {
			"weight": 4,
			"type": "bad_thing"
		} ,
 		"metaphorically conquer" : {
			"weight": 4,
			"voice": "active",
			"type": "good_thing"
		} ,
 		"assert your dominance over" : {
			"weight": 4,
			"voice": "active",
			"type": "good_thing"
		} , 
		"are" : {
			"type" : "sign_declaration",
			"voice" : "active" 
=======
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
>>>>>>> v3.0
		}
	} , 
	"@PrepositionalPhrase" : {
		"@Preposition @Object" : {"weight" : 4}
	} ,
<<<<<<< HEAD
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
		} ,
	} ,
	"@Object" : {
		"@Object @PrepositionalPhrase" : {
			"weight": 1,
			"type" : "not_sign_declaration"

		} ,
		"@ProperNoun" : {
			"weight": 7,
			"type" : "not_sign_declaration"
		} ,
		"@Conjunction @Noun" : {
			"weight": 7
		}
=======
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
>>>>>>> v3.0
	} ,
	"@Preposition" : {
		"in" : {"weight": 4},
		"with" : {"weight": 4},
<<<<<<< HEAD
		"thanks to" : {"weight": 4},
		"for better or for worse" : {"weight": 4} 
=======
		"thanks to" : {"weight": 4}
>>>>>>> v3.0
	} ,
	"@Noun" : {
		"star" : {
			"weight": 4,
<<<<<<< HEAD
			"type" : "not_sign_declaration"
		},
		"galaxy" : {
			"weight": 4,
			"type" : "not_sign_declaration"
		},
		"moose" : {
			"weight": 4,
			"type" : "not_sign_declaration"
		},
		"Aries" : {
			"weight" : 4,
			"type" : "sign_declaration"
		}
=======
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
>>>>>>> v3.0
	} ,
	"@ProperNoun" : {
		"Master Commander" : {"weight": 4},
		"Lord Ruler" : {"weight": 4},
		"God" : {"weight": 4},
		"Joe" : {"weight": 4}
	} ,
	"@Conjunction" : {
<<<<<<< HEAD
		"the" : {"weight": 4},
		"a" : {"weight": 4}
=======
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
>>>>>>> v3.0
	}
}


