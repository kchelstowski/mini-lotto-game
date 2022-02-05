const {Schema, model} = require('mongoose');

const PlayerSchema = new Schema({

    login: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});


module.exports = model('Player', PlayerSchema);
