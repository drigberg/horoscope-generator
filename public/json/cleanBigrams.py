import math
import sys
import json


def main():
    with open('sentence_types.json') as sentence_types_data:
        with open('sentencebigrams.json') as bigram_data:
            #ensure that all sentence types are in bigram probabilities
            sentence_types = json.load(sentence_types_data)
            bigrams = json.load(bigrams_data)
            for sentence_type in sentence_types:
                if sentence_type not in bigrams:
                    bigrams[sentence_type] = {}

                    prob_pool = 0
                    for key in exceptions:
                        prob_pool += exceptions[key]
                    prob_dispersion = prob_pool / len(bigrams.keys())

                    for key in bigrams.keys():
                        if key in exceptions:
                            bigrams[sentence_type][key] = exceptions[key]
                        else:
                            bigrams[sentence_type][key] = prob_dispersion

            if key == "@START":
                bigrams[key][sentence_type] = 0
            else:
                bigrams[key][sentence_type] = 0.1

            exceptions = {
                "signDeclaration_secondPerson" : 0,
                "@END"                         : 0.3
            }
            prob_pool = 0
            for key in exceptions:
                prob_pool += exceptions[key]

            prob_dispersion = prob_pool / len(bigrams.keys())
            for key in bigrams.keys():
                if key in exceptions:
                    bigrams[title][key] = exceptions[key]
                else:
                    bigrams[title][key] = prob_dispersion

                if key == "@START":
                    bigrams[key][title] = 0
                else:
                    bigrams[key][title] = 0.1

                nonzero_count = 0
                for conversion in bigrams[key]:
                    if conversion:
                        nonzero_count += 1

                for conversion in bigrams[key]:


    # with open('sentence_types.json', 'w') as revised_sentence_types_file:
    #     json.dump(sentence_types, revised_sentence_types_file)
    #
    # with open('sentencebigrams.json', 'w') as revised_probs_file:
    #     json.dump(bigrams, revised_probs_file)

if __name__ == '__main__':
    main()
