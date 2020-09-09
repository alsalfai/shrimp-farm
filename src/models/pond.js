const mongoose = require('mongoose')

const Pond = mongoose.model('Pond', {
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    }
})

module.exports = Pond