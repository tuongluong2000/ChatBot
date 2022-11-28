const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UtteranceSchema = new Schema({
    domain: {
        type: String,
        required: true
    },
    data:[{ 
        intent: {type: String, required: true},
        utterances:[{
            type: String,
            require: true
        }],
        answers:[{
            type: String,
            require: true
        }]
    }] 
});

module.exports = mongoose.model('Utterance', UtteranceSchema);