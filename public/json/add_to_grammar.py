import math
import sys
import json
import random


def main():
    with open('grammar.json') as grammar_data:
        with open('occupations.txt') as dictionary_data:
            with open ('ignore.json') as ignore_data:
                ignore = json.load(ignore_data)
                grammar = json.load(grammar_data)
                counter = 0
                breaker = ""
                default = raw_input("Set default part of speech for this session? ([default] or 'n'): ")
                position_in_alphabet = raw_input("Want to focus on a part of the alphabet in this session? ([letter] or 'no'): ")
                if default not in ["@Verb", "@Adverb", "@NounSingular", "@NounPlural", "@ProperNoun", "@Adjective"]:
                    default = False

                dictionary_array = []
                for word in dictionary_data:
                    dictionary_array.append(word.strip())
                while breaker != "y":
                    word = dictionary_array[int(math.floor(random.random()*len(dictionary_array)))]
                    if len(word) > 1 and breaker != "y" and word not in ignore:
                        skip = False
                        if position_in_alphabet != "no":
                            if word[0].lower() != position_in_alphabet:
                                skip = True
                        if not skip:
                            already_in_grammar = False
                            for key in grammar.keys():
                                if word in grammar[key]:
                                    already_in_grammar = True
                            if not already_in_grammar:
                                plural_version = False
                                singular_version = True
                                if counter % 5 == 0 :
                                    if counter != 0:
                                        breaker = raw_input("\n***** Break after this one? (y/n) ")
                                    if not default:
                                        print "\n***** Reminder! Parts of speech are @Verb, @Adverb, @NounSingular, @NounPlural, @ProperNoun, @Adjective!"
                                counter += 1

                                tags = {"weight" : 4}
                                include = raw_input("\n%s : do you want it? (y/n/alter) " % word)
                                if include.lower() == "alter":
                                    word = raw_input("Replacement word? ")
                                    ignore.append(word)
                                    include = "y"

                                if include.lower() == "n":
                                    ignore.append(word)
                                elif include.lower() == "y":
                                    if default:
                                        part_of_speech = default
                                    else:
                                        part_of_speech = raw_input(word + ": part of speech? ")
                                    if part_of_speech == "@Verb":
                            			tags["weight"] = raw_input("weight: ")
                            			tags["tense"] = raw_input("tense (present, past, future): ")
                            			tags["voice"] = raw_input("voice (active, passive): ")
                            			tags["person"] = raw_input("person (second, third): ")
                            			tags["verbtype"] = raw_input("verbtype (linking, transitive): ")
                                    elif part_of_speech == "@NounSingular":
                                        tags["weight"] = raw_input("weight: ")
                                        tags["object"] = raw_input("object (thing, role): ")
                                        plural_version = raw_input("plural? ([plural] or n) ")
                                    elif part_of_speech == "@NounPlural":
                                        tags["weight"] = raw_input("weight: ")
                                        tags["object"] = "thing"
                                        singular_version = raw_input("plural? ")
                                    elif part_of_speech == "@ProperNoun":
                            			tags["weight"] = raw_input("weight: ")
                            			tags["object"] = "thing"
                                    elif part_of_speech == "@Adjective":
                            			tags["weight"] = raw_input("weight: ")
                            			tags["good/bad"] = raw_input("good/bad: ")

                                    bail = raw_input("Make any mistakes on that one? (y/n) ")
                                    if bail != "y":
                                        try:
                                            grammar[part_of_speech][word] = tags
                                        except KeyError:
                                            print "Nonexistent part of speech! Skipping %s" % word
                                        if plural_version and plural_version != "n":
                                            if plural_version not in grammar["@NounPlural"]:
                                                grammar["@NounPlural"][plural_version] = tags
                                        if singular_version:
                                            if singular_version not in grammar["@NounPlural"]:
                                                grammar["@NounPlural"][plural_version] = tags

    print "Writing to files...\n"
    with open('grammar.json', 'w') as new_grammar_file:
        json.dump(grammar, new_grammar_file)

    with open('ignore.json', 'w') as ignore_file:
        json.dump(ignore, ignore_file)

    print "...Complete!"

if __name__ == '__main__':
    main()
