const {Schema, model} = require('mongoose');

const GameSchema = new Schema({

    id: {
        type: String,
        required: true,
    },
    players: [{type: Object}],
    winningNumbers: {
        type: [{type: Number}],
        required: true
    }


});

module.exports = model('Game', GameSchema);
