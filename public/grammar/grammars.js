
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
	} ,
	"@Preposition" : {
		"in" : {"weight": 4},
		"with" : {"weight": 4},
		"thanks to" : {"weight": 4},
		"for better or for worse" : {"weight": 4} 
	} ,
	"@Noun" : {
		"star" : {
			"weight": 4,
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
	} ,
	"@ProperNoun" : {
		"Master Commander" : {"weight": 4},
		"Lord Ruler" : {"weight": 4},
		"God" : {"weight": 4},
		"Joe" : {"weight": 4}
	} ,
	"@Conjunction" : {
		"the" : {"weight": 4},
		"a" : {"weight": 4}
	}
}


