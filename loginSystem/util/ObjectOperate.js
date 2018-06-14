/* 
    合并node对象，对于相同的属性后面覆盖前面
*/
class ObjectOperation {
    static combineObject(...objs) {
        let sum = {};
        let length = objs.length;
        for (let i = 0; i < length; i++) {
            // 判断是否是一个对象
            if (typeof (objs[i]) != 'object') {
                throw new Error('试图合并非对象数据');
                return;
            }
            let keys = Object.keys(objs[i]);
            keys.map(item => {
                sum[item] = objs[i][item];
            });
        }
        return sum;
    }
}


module.exports = ObjectOperation;