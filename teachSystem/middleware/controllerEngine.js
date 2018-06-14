const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');
const config = require('../config/config.js');

function addMapping(router, filePath) {
    let mapping = require(filePath);
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            let temp = url.substring(4);
            router.get(temp, mapping[url]);
            console.log(`----GET：${temp}`);
        } else if (url.startsWith('POST ')) {
            let temp = url.substring(5);
            router.post(temp, mapping[url]);
            console.log(`----POST：${temp}`);
        } else if (url.startsWith('PUT ')) {
            let temp = url.substring(4);
            router.put(temp, mapping[url]);
            console.log(`----PUT：${temp}`)
        } else if (url.startsWith('DELETE ')) {
            let temp = url.substring(7);
            router.delete(temp, mapping[url]);
            console.log(`----DELETE: ${temp}`);
        } else {
            console.log(`xxxxx无效路径：${url}`);
        }
    }
}

function addControllers(router, filePath) {
    let files = fs.readdirSync(filePath);
    files.forEach(element => {
        let temp = path.join(filePath, element);
        let state = fs.statSync(temp);
        if (state.isDirectory()) {
            addControllers(router, temp);
        } else {
            if (!temp.endsWith('Helper.js')) {
                console.log('\n--开始处理: ' + element + "路由");
                addMapping(router, temp);
            }
        }
    });
}

function engine(router, folder) {
    addControllers(router, folder);
    return router.routes();
}

module.exports = engine;