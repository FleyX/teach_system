'use strict'
const ErrorHelper = require('../util/ErrorHelper.js');

class announcementHelper {
    static checkGetParam(data) {
        try {
            data = JSON.parse(new Buffer(data, 'base64').toString());
        } catch (err) {
            throw ErrorHelper.Error400("参数不合法");
        }
        let params = {};
        try {
            params.c_id = data.c_id;
            params.start = data.start;
            params.count = data.count;
            let column = data.column;
            if (column == 'topic' || column == 'start_time' || column == "end_time") {
                params.column = column;
            } else {
                throw new Error();
            }
            params.sort = data.sort == 'desc' ? 'desc' : 'asc';
        } catch (err) {
            throw ErrorHelper.Error400("参数有误："+JSON.stringify(params));
        }
        return params;
    }
}

module.exports = announcementHelper;