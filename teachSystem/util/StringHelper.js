'use strict'

let chars = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
]

class StringHelper {
    /**
     * 获取随机字符串
     * @param {*0：字母数字混合 1：字母 2：数字} mode 
     * @param {*字符串长度} length 
     */
    static getRandomString(mode = 0, length = 6) {
        let temp = chars[mode];
        let max = temp.length - 1;
        let str = '';
        for (let i = 0; i < length; i++) {
            str += temp[StringHelper.getRandomNumber(max, 0)];
        }
        return str;
    }
    /**
     * 获取指定范围内随机数
     * @param {Number} max 
     * @param {Number} min 
     */
    static getRandomNumber(max, min) {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }

    static isEmpty(str) {
        if (str == null || str == undefined) {
            return true;
        }
        if (typeof (str) == 'string') {
            str = str.replace(/ /g, '');
            if (str.length == 0) {
                return true;
            }
            return false;
        }else{
            return true;
        }

    }

    /**
     * 构造sql查询语句参数
     * 返回"key1,key2,key3"
     * @param {Array} arr
     * @return {String} 
     */
    static sqlParams(arr) {
        let params = '';
        for (let i = 0; i < arr.length; i++) {
            params += arr[i];
            if (i != arr.length - 1) {
                params += ',';
            }
        }
        return params;
    }

    /**
     * 构造sql占位符
     * 返回"?,?,?"
     * @param {Number} length
     * @return  {String}
     */
    static sqlValues(length) {
        let params = '';
        for (let i = 0; i < length; i++) {
            params += '?';
            if (i != length - 1) {
                params += ',';
            }
        }
        return params;
    }

    /**
     * 构造sql更新语句参数
     * 返回"key1=?,key2=?"
     * @param {array} arr
     * @return {String}
     */
    static sqlUpdateParams(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str += arr[i] + '=?';
            if (i != arr.length - 1) {
                str += ',';
            }
        }
        return str;
    }

    /**
     * 构建where and条件
     * return "key1=? and key2=? and key3=?"
     * @param {Array} arr
     * @return {String}
     */
    static sqlWhereParams(arr) {
        let str = '';
        arr.forEach((item, index) => {
            if (index == arr.length - 1) {
                str += `${item}=?`
            } else {
                str += `${item}=? and `
            }
        })
        return str;
    }
}

module.exports = StringHelper;