import math
import sys
import json

new_sentence_conversion_exceptions = {
    "signDeclaration_secondPerson" : 0,
    "@END"                         : 0.3
}
default_probability = 0.15

def main():
    with open('sentenceTypes.json') as sentence_types_data:
        with open('sentenceBigrams.json') as bigram_data:
            #ensure that all sentence types are in bigram probabilities
            sentence_types = json.load(sentence_types_data)
            bigrams = json.load(bigram_data)

    bigrams = cleanProbabilities(checkForNewSentenceTypesInBigrams(sentence_types, bigrams))
    printBigrams(bigrams)

    with open('sentenceBigrams.json', 'w') as revised_bigrams_file:
        json.dump(bigrams, revised_bigrams_file)

def checkForNewSentenceTypesInBigrams(sentence_types, bigrams):
    for sentence_type in sentence_types:
        #add sentence_type with all conversions to bigrams if not present
        if sentence_type not in bigrams:
            bigrams[sentence_type] = {}
            occupied_prob_pool = 0
            for key in new_sentence_conversion_exceptions:
                occupied_prob_pool += new_sentence_conversion_exceptions[key]

            # Doesn't add to 1, but gets close--exact procedure is bulky and unnecessary here
            prob_dispersion = (1 - occupied_prob_pool) / (len(sentence_types) - len(new_sentence_conversion_exceptions))

            for key in sentence_types:
                if key in new_sentence_conversion_exceptions:
                    bigrams[sentence_type][key] = new_sentence_conversion_exceptions[key]
                else:
                    bigrams[sentence_type][key] = prob_dispersion
        else:
            #check that each existing sentence type has all possible conversions
            for key in sentence_types:
                if key not in bigrams[sentence_type]:
                    if key in new_sentence_conversion_exceptions:
                        bigrams[sentence_type][key] = new_sentence_conversion_exceptions[key]
                    else:
                        bigrams[sentence_type][key] = default_probability

    return bigrams

def printBigrams(bigram_data):
    print "\n\n\n*****BIGRAM DATA******\n"
    for sentence_type in bigram_data:
        print "\n\t%s:\n" % sentence_type
        prob_total = 0
        for conversion in bigram_data[sentence_type]:
            prob_total += bigram_data[sentence_type][conversion]
            conversion_for_display = conversion
            while len(conversion_for_display) < 50:
                conversion_for_display += " "
            print "\t\t%s:\t\t%s" % (conversion_for_display, bigram_data[sentence_type][conversion])
        total_display = "(Total)"
        while len(total_display) < 50:
            total_display += " "
        print "\t\t%s:\t\t%s" % (total_display, round(prob_total, 3))

def cleanProbabilities(bigram_data):
    for sentence_type in bigram_data:
        print "Evaluating conversions for %s....." % sentence_type
        #disperse excess/deficit evenly across nonzero probabilities
        prob_total = 0
        nonzero_count = 0
        for conversion in bigram_data[sentence_type]:
            if bigram_data[sentence_type][conversion]:
                prob_total += bigram_data[sentence_type][conversion]
                nonzero_count += 1

        if abs(prob_total - 1) > 1e-5:
            print "\t********* discrepancy:  %s" % round(prob_total - 1, 2)
            print "\t********* scaling probabilities..."
            for conversion in bigram_data[sentence_type]:
                if bigram_data[sentence_type][conversion]:
                    bigram_data[sentence_type][conversion] /= prob_total

            prob_total = 0
            for conversion in bigram_data[sentence_type]:
                bigram_data[sentence_type][conversion]
                prob_total += bigram_data[sentence_type][conversion]

        print "\tTotal probability: %s" % prob_total

    return bigram_data

if __name__ == '__main__':
    main()
