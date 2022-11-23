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
        required: true}] 
});

module.exports = mongoose.model('Context', ContextSchema);