import math
import sys
import json


def main():
    with open('sentence_types.json') as sentence_types_data:
        with open('sentencebigrams.json') as bigrams_data:
            exceptions = {
                "signDeclaration_secondPerson" : 0,
                "@END"                         : 0.3
            }
            sentence_types = json.load(sentence_types_data)
            bigrams = json.load(bigrams_data)
            counter = 0
            breaker = ""
            title = raw_input("Sentence type name: ")
            num_tags = input("Number of tags to add: ")
            tags = {}
            for n in range(int(num_tags)):
                print "******"
                new_tag = raw_input("New tag name: ")
                tag_value = raw_input("Tag value: ")
                print "******"
                tags[new_tag] = tag_value

            sentence_types[title] = tags

            #add sentence type as conversion for each existing type and as node






    # with open('sentence_types.json', 'w') as revised_sentence_types_file:
    #     json.dump(sentence_types, revised_sentence_types_file)
    #
    # with open('sentencebigrams.json', 'w') as revised_bigrams_file:
    #     json.dump(bigrams, revised_bigrams_file)

if __name__ == '__main__':
    main()
