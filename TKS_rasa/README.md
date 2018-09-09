# README #

* TO TRAIN: `python -m rasa_nlu.train config_spacy.json`
* TO START THE SERVER: `python -m rasa_nlu.server -c config_spacy.json`
* TO EVALUATE - CROSS VALIDATION: `python -m rasa_nlu.evaluate -d training_data/ -c config_spacy.json --mode crossvalidation`

`python -m rasa_nlu.evaluate -d data/my_test.json -m models/my_model -c config_spacy.json`
