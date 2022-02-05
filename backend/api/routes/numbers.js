const express = require('express');
const router = express.Router();
const Number = require('../models/Number');


router.get('/', async (req, res) => {
    try {
        const result = await Number.find()
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});
router.get('/:user', async (req, res) => {
    try {
        const result = await Number.find({user: req.params.user})
        return res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/', async (req, res) => {
    try {
        await new Number({
            user: req.body.user,
            numbers: req.body.numbers
        }).save();
        return res.status(200).send("Numbers added")
    } catch (err) {
        res.status(500).send(err);
    }
});
router.put('/:id', async (req, res) => {
    try {
        await Number.findByIdAndUpdate(req.params.id, {numbers: req.body.numbers})
        res.status(200).send("Numbers edited")
    } catch (e) {
        res.status(500).send("Error while editing")
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Number.findByIdAndDelete(req.params.id)
        res.status(200).send("Numbers have been deleted")
    } catch (e) {
        res.status(500).send("Error while deleting")
    }
})


module.exports = router;
