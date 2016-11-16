import math
import sys
import json


def main():
    with open('grammar.json') as grammar_data:
        with open('dictionary.json') as dictionary_data:
            grammar = json.load(grammar_data)
            dictionary = json.load(dictionary_data)
            reminder = 0
            for word in dictionary:
                if not reminder:
                    print "Reminder! Parts of speech are @Verb, @Adverb, @Noun, @ProperNoun, @Adjective!"
                reminder += 1

                if reminder == 3:
                    reminder = 0
                tags = {"weight" : 4}
                part_of_speech = raw_input(word + ": part of speech? ")
                if part_of_speech == "@Verb":
        			tags["weight"] = raw_input("weight: ")
        			tags["tense"] = raw_input("tense: ")
        			tags["voice"] = raw_input("voice: ")
        			tags["person"] = raw_input("person: ")
        			tags["verbtype"] = raw_input("verbtype: ")
                # elif part_of_speech == "@Adverb":
                # elif part_of_speech == "@Noun":
                # elif part_of_speech == "@ProperNoun":
                # elif part_of_speech == "@Adjective":
                grammar[part_of_speech][word] = tags

    with open('new_grammar.json', 'w') as new_grammar_file:
        json.dump(grammar, new_grammar_file)


if __name__ == '__main__':
    main()
