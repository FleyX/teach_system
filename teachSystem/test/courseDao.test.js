'use strict'
const courseDao = require('../dao/courseDao.js');

describe('#addOne(data)', () => {
    it('should be done', async () => {
        let res = await courseDao.addOne({
            code: '1234',
            c_name: "c++程序设计",
            teacher: [{
                u_id: 14,
                u_name: 'asdf'
            }, {
                u_id: 15,
                u_name: 'asdf'
            }]
        });
        await courseDao.deleteOne(res.c_id);
    })
})

describe('#updateOne(data,c_id)', () => {
    it('should be done', async () => {
        await courseDao.updateOne({
            code: '12345',
            c_name: "c++",
            teacher: [{
                u_id: 14,
                u_name: 'asdf'
            }]
        }, res.c_id);
    })
})

describe('#deleteOne(c_id)',()=>{
    it('should be done',async()=>{
        await courseDao.deleteOne();
    })
})