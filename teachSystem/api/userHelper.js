'use strict'
let stringHelper = require('../util/StringHelper.js');
let ErrorHelper = require('../util/ErrorHelper.js');

class userHelper {
    //检查增加用户参数
    static checkAddUserParams(params) {
        if (stringHelper.isEmpty(params.u_name) || stringHelper.isEmpty(params.u_type) ||
            stringHelper.isEmpty(params.code) || stringHelper.isEmpty(params.password)) {
            throw ErrorHelper.Error400("某项输入为空");
        }
    }

    static checkChangePasswordParams(params,userInfo) {
        if (stringHelper.isEmpty(params.password) || stringHelper.isEmpty(params.newPassword) || stringHelper.isEmpty(params.repeatNewPassword)) {
            throw ErrorHelper.Error400("某项输入为空");
        }
        if (params.newPassword != params.repeatNewPassword) {
            throw ErrorHelper.Error400("两次密码输入不一致");
        }
    }

    //检查检索参数
    static getParams(data) {
        let params = {};
        try {
            let param = new Buffer(data, 'base64').toString();
            param = JSON.parse(param);
            params.orderBy = param.orderBy;
            params.start = param.start;
            params.count = param.count;
            params.sort = param.sort == 'desc' ? 'desc' : 'asc';
            if (param.search != undefined && param.search.content.length > 0 && (param.search.filed == 'code' || param.search.filed == 'u_id' || param.search.filed == 'u_name') && typeof (param.search.content) == 'string') {
                params.search = param.search;
            }
            if (param.u_type.length > 0) {
                params.u_type = '(';
                for (let i = 0; i < param.u_type.length; i++) {
                    if (typeof (param.u_type[i]) != 'number') {
                        throw new Error();
                    }
                    if (i == 0) {
                        params.u_type += param.u_type[i];
                    } else {
                        params.u_type += ',' + param.u_type[i];
                    }
                }
                params.u_type += ')';
            } else {
                params.u_type = null;
            }
            return params;
        } catch (error) {
            throw ErrorHelper.Error400('参数不合法');
        }
    }
}

module.exports = userHelper;