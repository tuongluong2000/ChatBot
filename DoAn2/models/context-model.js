const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContextSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    adminid: {
        type: String,
        required: true
    },
    suggested:[{ 
        type: String,
        required: true}],
    username: {
        type: String,
        require:true
    },
    content: {
        type: String,
        require: true
    },
    timestamp: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Context', ContextSchema);