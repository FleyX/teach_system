'use strict'
const MysqlHelper = require('../util/MysqlHelper.js');

class announcementDao {
    static async getByParam(params) {
        let res;
        let data = await MysqlHelper.row(`
            select a_id,topic,start_time,end_time from announcement where c_id=? order by ${params.column} ${params.sort} limit ?,10           
            `, params.c_id, params.start);
        data.forEach(item => {
            if (item.end_time > Date.now() && item.start_time < Date.now()) {
                item.isClosed = false;
            } else {
                item.isClosed = true;
            }
        })
        if (params.count) {
            res = {};
            res.count = await MysqlHelper.single(`select count(a_id) from announcement where c_id=?`, params.c_id);
            res.data = data;
        } else {
            res = data;
        }
        return res;
    }

    static async getOpenAnnouncement(c_id) {
        let now = Date.now();
        let res = await MysqlHelper.row(`
            SELECT a_id,topic,start_time from announcement where c_id=? and start_time<? and end_time>? order by start_time desc
            `, c_id, now, now);
        return res;
    }

    static async getContent(a_id) {
        return await MysqlHelper.single(`select content from announcement where a_id=?`, a_id);
    }

    static async switchOne(a_id, action) {
        let end_time = Date.now();
        let start_time = Date.now();
        if (action == 'true') {
            end_time += 30 * 365 * 24 * 60 * 60 * 1000;
        }
        await MysqlHelper.execute(`update announcement set end_time=?,start_time=? where a_id=?`, end_time, start_time, a_id);
        return {end_time,start_time};
    }

    static async addOne(data) {
        if (data.start_time == '') {
            data.start_time = Date.now();
            data.end_time = 4100731932000;
        }
        await MysqlHelper.execute(`
            insert into announcement(c_id,topic,content,start_time,end_time) values(?,?,?,?,?)
            `, data.c_id, data.topic, data.content, data.start_time, data.end_time);
    }

    static async deleteOne(a_id) {
        await MysqlHelper.execute(`delete from announcement where a_id=?`, a_id);
    }

}

module.exports = announcementDao;