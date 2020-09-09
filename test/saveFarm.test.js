const expect = require('chai').expect
const setup = require('./helper/setup')
const app = require('../src/routers/farm')
const Farm = require('../src/models/farm')
const { assert } = require('console')

describe('POST: /farms route to insert data', ()=>{
    setup();
  
    it('Creates farm', (done) => {
        const farm = new Farm({name:'Test Shrimp'})
        farm.save()
        .then(() => {
            assert(!farm.isNew)
            done();
        }).catch((err) => done(err))
    })
})