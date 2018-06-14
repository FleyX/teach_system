'use strict'

class ErrorHelper {
    /**
     * 返回一个自定义错误，一般情况下请勿使用
     * @param {String} message 
     * @param {Number} status 
     */
    static newError(message, status) {
        return getError(message, status);
    }

    /**
     * 返回一个无访问权限错误
     */
    static authError() {
        return getError('无访问权限', 403);
    }

    static Error403(message){
        return getError(message,403);
    }
    static Error406(message){
        return getError(message,406);
    }
    static Error400(message){
        return getError(message,400);
    }

}

let getError = (message, status) => {
    let error = new Error(message);
    error.status = status;
    return error;
}

module.exports = ErrorHelper;