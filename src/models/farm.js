const mongoose = require('mongoose')

const Farm = mongoose.model('Farm', {
    name: {
        type: String,
        required: true
    },
    ponds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pond'
    }]
})

module.exports = Farm