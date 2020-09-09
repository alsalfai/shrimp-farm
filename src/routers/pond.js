const express = require('express')
const Pond = require('../models/pond')
const Farm = require('../models/farm')
const ObjectId = require('mongoose').Types.ObjectId;

const router = new express.Router()

router.get('/ponds', async (req, res) => {
    try {
        const ponds = await Pond.find({})
        res.send(ponds)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/ponds/:id', async (req, res) => {
    try {
        const pond = await Pond.findById(req.params.id)
        pond ? res.send(pond) : res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/ponds', async (req, res) => {
    try {
        const {name, size, farm} = req.body
        const parentFarm = await Farm.findById(farm)
        if (!parentFarm) return res.status(400).send({error: "Invalid ObjectId for farm."})
        const pond = await Pond.create({name, size, farm})

        parentFarm.ponds.push(pond)
        await parentFarm.save()

        res.status(201).send(pond)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/ponds/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'size']
    const isValidUpdate = updates.every((field) => validUpdates.includes(field))
    if (!isValidUpdate) return res.status(400).send({
        error: 'Invalid updates!'
    })

    try {
        const pond = await Pond.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        pond ? res.send(pond) : res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/ponds/:id', async (req, res) => {
    try {
        const pondId = req.params.id
        const deletedPond = await Pond.findByIdAndDelete(pondId)
        if (!deletedPond) return res.status(404).send()

        const farm = await Farm.findById(deletedPond.farm)
        const index = farm.ponds.indexOf(pondId)
        farm.ponds.splice(index, 1)
        await farm.save()

        res.send(deletedPond)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/ponds/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!ObjectId.isValid(id)) return res.render("notfound")

        const pond = await Pond.findById(req.params.id)
        if (!pond) return res.render("notfound")

        res.render("edit-pond", {
            farmId: pond.farm,
            name: pond.name,
            size: pond.size
        })
    } catch (e) {
        res.render("error")
    }
})

module.exports = router