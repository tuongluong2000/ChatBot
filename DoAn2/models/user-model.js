const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    createday: {
        type: String,
        required: true
    },
    decentralize: {
        type: String,
        required: true
    }, stt: {
        type: String,
        required: true
    }, date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);