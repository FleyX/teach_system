'use strict'
const ErrorHelper = require('../util/ErrorHelper.js');
class questionLibraryHelper {
    //检查检索参数是否合法
    static checkGetParam(params) {
        try {
            params = JSON.parse(new Buffer(params.data, 'base64').toString());
            if (params.searchColumn !== '' && (params.searchColumn !== 'ql_id' && params.searchColumn !== 'q_simple_description'))
                throw new Error();
            let index = params.q_type.findIndex(item => typeof(item) !== 'number');
            if (index != -1)
                throw new Error();
        } catch (err) {
            throw ErrorHelper.newError("参数不合法", 406);
        }
        return params;
    }

    static checkPostParam(params) {
        if (params.c_id == undefined)
            throw ErrorHelper.newError("c_id不存在", 406);
        if (params.q_simple_description == undefined)
            throw ErrorHelper.newError("题目简述不存在", 406);
        if (params.q_description == undefined || params.q_description.length == 0)
            throw ErrorHelper.newError("题目内容为空", 406);
        if (params.q_description.length >= 65535)
            throw ErrorHelper.newError("题目内容超过65535", 406);
        if (params.q_type < 3) {
            if (params.alternative_answer == undefined || params.alternative_answer.length == 0)
                throw ErrorHelper.newError("备选项为空", 406);
            let length = 0;
            params.alternative_answer.forEach(item => length += item.length);
            if (length >= 4096)
                throw ErrorHelper.newError("备选项长度超过4096", 406);
        } else {
            params.alternative_answer = '';
        }
        if (params.answer == undefined || params.answer.length == 0)
            throw ErrorHelper.newError("未指定正确答案", 406);
    }
}

module.exports = questionLibraryHelper;