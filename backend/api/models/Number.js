const {Schema, model} = require('mongoose');

const NumberSchema = new Schema({

    user: {
        type: String,
        required: true
    },
    numbers: [{type: Number, required: true}]


});

module.exports = model('Number', NumberSchema);
