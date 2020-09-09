const mongoose = require('mongoose')

function dbconnect() {
        mongoose.connect('mongodb://127.0.0.1:27017/shrimp-farm', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
        })
        return mongoose.connection
}

function dbclose() {
        return mongoose.disconnect();
}
    
module.exports = {dbconnect, dbclose};