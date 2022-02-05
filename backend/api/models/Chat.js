const {Schema, model} = require('mongoose');

const ChatSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String
    }


});

module.exports = model('Chat', ChatSchema);
