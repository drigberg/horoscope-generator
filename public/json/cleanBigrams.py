import math
import sys
import json

new_sentence_conversion_exceptions = {
    "signDeclaration_secondPerson" : 0,
    "@END"                         : 0.3
}

def main():
    with open('sentenceTypes.json') as sentence_types_data:
        with open('sentenceBigrams.json') as bigram_data:
            #ensure that all sentence types are in bigram probabilities
            sentence_types = json.load(sentence_types_data)
            bigrams = json.load(bigram_data)
            temp = cleanProbabilities(bigrams)
            # for sentence_type in sentence_types:
            #     #add sentence_type with all conversions to bigrams if not present
            #     if sentence_type not in bigrams:
            #         bigrams[sentence_type] = {}
            #         occupied_prob_pool = 0
            #         for key in new_sentence_conversion_exceptions:
            #             prob_pool += new_sentence_conversion_exceptions[key]
            #
            #         prob_dispersion = (1 - occupied_prob_pool) / (len(sentence_types) - len(new_sentence_conversion_exceptions))
            #
            #         for key in sentence_types:
            #             if key in new_sentence_conversion_exceptions:
            #                 bigrams[sentence_type][key] = new_sentence_conversion_exceptions[key]
            #             else:
            #                 bigrams[sentence_type][key] = prob_dispersion
            #     else:
            #         #check that each existing sentence type has all possible conversions
            #         for key in sentence_types:
            #             if key not in bigrams[sentence_type]:
            #                 if key in new_sentence_conversion_exceptions:
            #                     bigrams[sentence_type][key] = new_sentence_conversion_exceptions[key]
            #                 else:
            #                     bigrams[sentence_type][key] = 0.1


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

        discrepancy = prob_total - 1
        dispersion = discrepancy / nonzero_count
        if abs(discrepancy) > 1e-5:
            print "\t********* discrepancy:  %s" % discrepancy
            print "\t********* dispersion: %s" % dispersion
        debug_counter = 0
        while abs(discrepancy) > 1e-5 and debug_counter < 10:
            debug_counter += 1
            for conversion in bigram_data[sentence_type]:
                if bigram_data[sentence_type][conversion]:
                    if bigram_data[sentence_type][conversion] - dispersion > 0:
                        print "\t\t********Subtracting %s from %s for %s" % (dispersion, bigram_data[sentence_type][conversion], conversion)
                        bigram_data[sentence_type][conversion] -= dispersion
                        discrepancy -= dispersion
                        if abs(discrepancy) < 1e-5:
                            print "\t\t\t*********Total probability 1 reached"
                            break
            prob_total = 0
            for conversion in bigram_data[sentence_type]:
                if bigram_data[sentence_type][conversion]:
                    prob_total += bigram_data[sentence_type][conversion]
            print "\t\t\t*********Total probability: %s" % prob_total
            print "\t\t\t********** discrepancy: %s" % round(discrepancy, 2)

        print "\tTotal probability: %s" % prob_total

    return bigram_data


    # with open('sentence_types.json', 'w') as revised_sentence_types_file:
    #     json.dump(sentence_types, revised_sentence_types_file)
    #
    # with open('sentencebigrams.json', 'w') as revised_probs_file:
    #     json.dump(bigrams, revised_probs_file)

if __name__ == '__main__':
    main()
