import math
import sys
import json


def main():
    with open('sentenceTypes.json') as sentenceTypes_data:
        with open('sentenceBigramProbabilities.json') as bigramProbs_data:
            sentenceTypes = json.load(sentenceTypes_data)
            bigramProbs = json.load(bigramProbs_data)
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

            sentenceTypes[title] = tags

            for key in bigramProbs.keys():
                bigramProbs[title][key] =  
                bigramProbs[key]


    with open('sentenceTypes.json', 'w') as revisedSentenceTypes_file:
        json.dump(sentenceTypes, revisedSentenceTypes_file)

    with open('sentenceBigramProbabilities.json', 'w') as revisedProbs_file:
        json.dump(bigramProbs, revisedProbs_file)

if __name__ == '__main__':
    main()
