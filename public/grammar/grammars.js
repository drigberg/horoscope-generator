var generic_grammar = {
	"@ROOT" : {
		"@Subject @PassivePredictor" : {"weight" : 4} , 
		"@Subject @ActivePredictor"  : {"weight": 4} ,
		"@Subject @ActiveStatement" : {"weight": 4} ,
		"@Subject @PassiveHistory" : {"weight": 4} ,
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
 		"assert your dominance over" : {"weight": 4}
	} ,
	"@PrepositionalPhrase" : {
		"in the",
		""
	} ,
	"@Subject" : {
		"you" : {"weight": 4} ,
		"your mother" : {"weight": 4} ,
		"your father" : {"weight": 4} ,
	} ,
	"@Object" : {
		"@Object @PrepositionalPhrase" : {"weight": 1} ,
		"@Conjunction @ProperNoun" : {"weight": 7} ,
		"@Conjunction @Noun" : {"weight": 7}
	}
}