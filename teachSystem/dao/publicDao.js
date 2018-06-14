const config = require("../config/config.js");
const path = require('path');
const uuid = require('uuid');
const fs = require("fs-extra");

class publicDao {
    static async uploadImg(param) {
        let res = {
            errno: 0,
            data: []
        }
        try {
            for (let key in param) {
                let item = param[key];
                let id = uuid.v1();
                let dest = path.join(config.staticPath, 'imgs', id);
                await fs.move(item.path, dest);
                res.data.push(config.host+'imgs/'+id);
            }
        } catch (err) {
            res.errno = 1;
        }
        return res;
    }
}

module.exports = publicDao;