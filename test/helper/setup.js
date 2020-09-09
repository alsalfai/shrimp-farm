const mongooseConnect = require('../../src/db/mongoose');
const mongoose = require('mongoose');

let setup = () => {
    before((done)=>{              
        mongooseConnect.dbconnect()   
                .once('open', ()=> done())
                .on('error',(error) => done(error))
    })
    beforeEach((done)=>{          
        mongoose.connection.db.listCollections({name: "shrimp-farm"})
            .next((error,collection)=>{
                if(collection){
                    mongoose.connection.db.dropCollection("shrimp-farm")    
                    .then(() => done())                                       
                    .catch((err) => done(err))
                }
                else{
                    done(error)
                }
            })
    })

    after((done)=>{                       
        mongooseConnect.dbclose()
                .then(()=>done())
                .catch((err)=>done(err))
    })
}

module.exports = setup;