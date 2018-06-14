/* 
    合并node对象，对于相同的属性后面覆盖前面
*/
class ObjectOperation {
    static combineObject(...objs) {
        if (objs.length == 1 && objs[0] instanceof Array) {
            objs = objs[0];
        }
        let sum = {};
        let length = objs.length;
        for (let i = 0; i < length; i++) {
            // // 判断是否是一个对象
            // if (typeof (objs[i]) != 'object') {
            //     throw new Error('试图合并非对象数据');
            //     return;
            // }
            // let keys = Object.keys(objs[i]);
            // keys.map(item => {
            //     sum[item] = objs[i][item];
            // });
            sum = Object.assign(sum,objs[i]);
        }
        return sum;
    }
}


module.exports = ObjectOperation;