const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    contextid: {
        type: String,
        required: true
    },
    senderid: {
        type: String,
        required: true
    },
    content:{ 
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);