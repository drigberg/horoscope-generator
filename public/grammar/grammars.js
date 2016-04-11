var sentence_types = {
	"sign_declaration" : {
		"sign" : true,
		"active" : true
	} ,
	"bad_statement" : {
		"bad" : true,
		"future" : true
	}
}

var grammars = {
	general_grammar : {
		"@ROOT" : {
			"@Subject @VerbPhrase"  : {"weight": 4, "bad" : true},
			"@PrepositionalPhrase , @Subject @VerbPhrase" : {"weight": 4}
		} ,
		"@VerbPhrase" : {
			"@Verb @Object" : {"weight": 4}
		} ,
		"@Verb" : {
			"eaten" : {
				"weight": 4,
				"passive": true,
				"bad": true
			} ,
			"destroyed" : {
				"weight": 4,
				"passive": true,
				"bad": true
			} ,
			"destroy" : {
				"weight": 4,
				"active": true,
				"bad": true
			} ,
			"subjugated" : {
				"weight": 4,
				"active": true,
				"bad": true
			} ,
			"philosophically challenged" : {
				"weight": 4,
				"passive": true,
				"bad": true
			} ,
			"granted diplomatic immunity" : {
				"weight": 4,
				"passive": true,
				"bad": true
			} ,
			"sacrificed" : {
				"weight": 4,
				"passive": true,
				"bad": true
			} ,
	 		"metaphorically conquer" : {
				"weight": 4,
				"active": true,
				"bad": true
			} ,
	 		"assert your dominance over" : {
				"weight": 4,
				"active": true,
				"bad": true
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
			"@Object @PrepositionalPhrase" : {"weight": 1} ,
			"@ProperNoun" : {"weight": 7} ,
			"@Conjunction @Noun" : {"weight": 7}
		} ,
		"@Preposition" : {
			"in" : {"weight": 4},
			"with" : {"weight": 4},
			"thanks to" : {"weight": 4}
		} ,
		"@Noun" : {
			"star" : {"weight": 4},
			"galaxy" : {"weight": 4},
			"moose" : {"weight": 4},
			"Aries" : {
				"weight" : 4,
				"sign" : true
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
	} ,
	old_grammar : {
		"@ROOT" : {
			"OLD @Subject @PassivePredictor" : {"weight" : 4} , 
			"OLD @Subject @ActivePredictor"  : {"weight": 4} ,
			"OLD @Subject @ActiveStatement" : {"weight": 4} ,
			"OLD @Subject @PassiveHistory" : {"weight": 4} ,
		} ,
		"@PassivePredictor" : {
			"will be @PassiveVerb @PrepositionalPhrase" : {"weight": 4}
		} ,
		"@ActivePredictor" : {
			"will @ActiveVerb @Object" : {"weight": 4}
		} ,
		"@ActiveStatement" : {
			"@ActiveVerb @Object" : {"weight": 4}
		} , 
		"@PassiveHistory" : {
			"have been @PassiveVerb @PrepositionalPhrase" : {"weight": 4}
		} , 
		"@PassiveVerb" : {
			"eaten" : {"weight": 4},
			"destroyed" : {"weight": 4},
			"subjugated" : {"weight": 4},
			"philosophically challenged" : {"weight": 4}
		} , 
		"@ActiveVerb" : {
	 		"metaphorically conquer" : {"weight": 4},
	 		"assert your dominance over" : {"weight" : 4}
		} ,
		"@PrepositionalPhrase" : {
			"in the @Object" : {"weight" : 4}
		} ,
		"@Subject" : {
			"you" : {"weight": 4} ,
			"your mother" : {"weight": 4} ,
			"your father" : {"weight": 4} ,
		} ,
		"@Object" : {
			"@Object @PrepositionalPhrase" : {"weight": 1} ,
			"@ProperNoun" : {"weight": 7} ,
			"@Conjunction @Noun" : {"weight": 7}
		} ,
		"@Noun" : {
			"star" : {"weight": 4},
			"galaxy" : {"weight": 4},
			"moose" : {"weight": 4}
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
}


