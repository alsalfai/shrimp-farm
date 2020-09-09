const express = require('express')
const Farm = require('../models/farm')
const Pond = require('../models/pond')
const ObjectId = require('mongoose').Types.ObjectId;

const router = new express.Router()

router.get('/farms', async (req, res) => {
    try {
        const farms = await Farm.find({})
        res.send(farms)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/farms/:id', async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id)
        farm ? res.send(farm) : res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/farms/:id/ponds', async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id)
        if (!farm) return res.status(404).send()

        let farmSize = 0
        let ponds = []
        for (pondId of farm.ponds) {
            const pond = await Pond.findById(pondId)
            farmSize += pond.size
            ponds.push(pond)
        }

        res.send({ponds, farmSize})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/farms', async (req, res) => {
    try {
        const farm = await Farm.create(req.body)
        res.status(201).send(farm)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/farms/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    if (updates.length !== 1 || updates[0] !== 'name') return res.status(400).send({
        error: 'Invalid updates!'
    })

    try {
        const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        farm ? res.send(farm) : res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/farms/:id', async (req, res) => {
    try {
        const deltedFarm = await Farm.findByIdAndDelete(req.params.id)
        if (!deltedFarm) return res.status(404).send()

        deltedFarm.ponds.forEach(async (pond) => {
            await Pond.findByIdAndDelete(pond)
        })

        res.send(deltedFarm)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/farms/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!ObjectId.isValid(id)) return res.render("notfound")

        const farm = await Farm.findById(req.params.id)
        if (!farm) return res.render("notfound")

        res.render("edit-farm", {
            name: farm.name
        })
    } catch (e) {
        res.render("error")
    }
})

module.exports = router