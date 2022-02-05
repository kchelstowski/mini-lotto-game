const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    try {
        const result = await Chat.find()
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:user', async (req, res) => {
    try {
        const result = await Chat.find({user: req.params.user})
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/chat/pattern/:pattern', async (req, res) => {
    try {
        const result = await Chat.aggregate([
            {
                $match: {
                    message: {$regex: `${req.params.pattern}`, '$options': 'i'}
                }
            }
        ])
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/', async (req, res) => {
    const data = []
    try {
        const result = await new Chat({
            id: req.body.id,
            user: req.body.user,
            message: req.body.message
        }).save()
        data.push(result)
        return res.status(200).send(data)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', async (req, res) => {
    const data = []
    try {
        const messageToEdit = await Chat.findOneAndUpdate({id: req.params.id}, {
            id: req.body.id,
            message: req.body.message,
            user: req.body.user

        })
        data.push(messageToEdit)
        return res.status(200).send(data)


    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    const data = []
    try {
        await Chat.findOneAndDelete({id: req.params.id})
        data.push("Message has been deleted from history")
        return res.status(200).send(data)


    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;
