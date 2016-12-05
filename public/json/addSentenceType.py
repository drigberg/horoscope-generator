import math
import sys
import json


def main():
    exceptions = {
        "signDeclaration_secondPerson" : 0,
        "@END"                         : 0.3
    }
    sentence_types_file = 'sentenceTypes.json'
    bigram_file = 'sentenceBigrams.json'
    with open(sentence_types_file) as sentence_types_data:
        with open(bigram_file) as bigrams_data:
            operation = raw_input("Add or remove? (a/r): ")
            if operation.lower() == "a":
                sentence_types = json.load(sentence_types_data)
                bigrams = json.load(bigrams_data)
                title = raw_input("Sentence type name: ")
                num_tags = int(raw_input("Number of tags to add: "))
                tags = {}
                for n in range(int(num_tags)):
                    print "\n******"
                    new_tag = raw_input("New tag name: ")
                    tag_value = raw_input("Tag value: ")
                    print "******\n"
                    tags[new_tag] = tag_value
                sentence_types[title] = tags

            elif operation.lower() == "r":
                sentence_types = json.load(sentence_types_data)
                bigrams = json.load(bigrams_data)
                title = raw_input("Sentence type to remove: ")
                sentence_types.pop(title, None)
                bigrams.pop(title, None)
                for sentence_type in bigrams:
                    bigrams[sentence_type].pop(title, None)
                print "%s removed from %s and %s \n" % (title, sentence_types_file, bigram_file)

    print "*********\nCleaning bigram probabilities and adding sentence types if applicable....\n"
    bigrams = cleanBigrams.cleanProbabilities(cleanBigrams.checkForNewSentenceTypesInBigrams(sentence_types, bigrams))

    print "\nNew sentence type list: "
    for key in sentence_types:
        print "\t %s" % key

    with open('sentence_types.json', 'w') as revised_sentence_types_file:
        json.dump(sentence_types, revised_sentence_types_file)

    with open('sentencebigrams.json', 'w') as revised_bigrams_file:
        json.dump(bigrams, revised_bigrams_file)

if __name__ == '__main__':
    main()
