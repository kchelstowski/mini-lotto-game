const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const fs = require("fs")


router.get('/', async (req, res) => {
    try {
        const result = await Game.find()
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/ranking', async (req, res) => {
    try {
        const result = await Game.aggregate([
            {
                $project: {
                    _id: 0,
                    id: 1,
                    players: 1,
                    winningNumbers: 1,
                    sizePlayers: {$size: "$players"}
                }
            },
            {
                $match: {
                    sizePlayers: {$gt: 0}
                }
            },
            {
                $group: {
                    _id: "$players.login",
                    players: {$push: {players: "$players", winningNumbers: "$winningNumbers"}}
                }
            },
            {
                $project: {
                    _id: 1,
                    games: {
                        player: "$players.players.login",
                        playerNumbers: "$players.players.numbers",
                        winningNumbers: "$players.winningNumbers"
                    }
                }
            }
        ])
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/export', async (req, res) => {
    try {
        const result = await Game.aggregate([
            {
                $project: {
                    _id: 0,
                    id: 1,
                    players: 1,
                    winningNumbers: 1
                }
            }
        ])
        fs.writeFile("/Users/kacperchelstowski/Desktop/II_rok/psw/projekt/src/ui/main/games.json", JSON.stringify(result), 'utf8', function (err) {
            if (err) {
                console.log(err);
            }
            console.log("file saved!");
        })
        return res.send("File saved to games.json!")
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/', async (req, res) => {
    const data = []
    try {
        const result = await new Game({
            id: req.body.id,
            players: req.body.players,
            winningNumbers: req.body.winningNumbers,
        }).save()
        data.push(result)
        return res.status(200).send(data)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', async (req, res) => {
    const data = []
    const player = {
        login: req.body.player.login,
        numbers: req.body.player.numbers
    }
    console.log(player)
    try {
        const game = await Game.findOneAndUpdate({id: req.params.id}, {
            $addToSet: {
                "players": player
            }
        })
        data.push(game)
        return res.status(200).send(data)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    const data = []
    try {
        await Game.findOneAndDelete({id: req.params.id})
        data.push("Game has been deleted")
        return res.status(200).send(data)


    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;
