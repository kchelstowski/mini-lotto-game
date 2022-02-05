const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;


router.get('/', async (req, res) => {
    try {
        const result = await Player.find()
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:login', async (req, res) => {
    try {
        const result = await Player.find({login: req.params.login})
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', async (req, res) => {
    const data = []
    const hashedPwd = await bcrypt.hash(req.body.password, SALT_WORK_FACTOR);
    try {
        const duplicate = await Player.find({login: req.body.login})
        console.log(duplicate)
        if (duplicate.length === 0) {
            const result = await new Player({
                login: req.body.login,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPwd
            }).save()
            data.push(result)
            return res.status(200).send(data)
        }
        return res.status(500).send("Player of this login already exists")
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/login/:login/:password', async (req, res) => {
    try {
        const user = await Player.findOne({login: req.params.login})
        if (user) {
            const cmp = await bcrypt.compare(req.params.password, user.password);
            if (cmp) {
                res.send("Auth Successful");
            } else {
                res.send("Wrong username or password.");
            }
        } else {
            res.send("Wrong username or password.");
        }

    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:login', async (req, res) => {
    const data = []
    try {
        const playerToEdit = await Player.findOneAndUpdate({login: req.params.login}, {
            login: req.body.login,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        })
        data.push(playerToEdit)
        return res.status(200).send(data)


    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:login', async (req, res) => {
    const data = []
    try {
        await Player.findOneAndDelete({login: req.params.login})
        data.push("Account has been deleted")
        return res.status(200).send(data)


    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;
