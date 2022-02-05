const express = require('express');
const app = express();

const mongoose = require('mongoose');
const players = require('./routes/players');
const games = require('./routes/games')
const chat = require('./routes/chat')
const numbers = require('./routes/numbers')
const cors = require("cors");
app.use(cors())
const port = 5000;
app.use(express.json());
app.use('/players', players);
app.use('/games', games)
app.use('/chat', chat)
app.use('/numbers', numbers)
const publisher = require("../mqtt/publisher")


mongoose.connect('mongodb://localhost:27017/lotto').then(() => {
    console.log('Connected to mongoDB');
    app.listen(port, () => {
        console.log(`App is listening at port ${port}`);
    });
}).catch(e => console.log(e))



