'use strict'
const js_xlsx = require('js-xlsx');
const xlsx = require('xlsx');
const fs = require('fs-extra');

class classHelper {
    static getTableInfo(file) {
        let content = xlsx.readFile(file.path);
        let sheetName = content.SheetNames[0];
        let res = xlsx.utils.sheet_to_json(content.Sheets[sheetName],{header:['u_name','code','password']});
        return res;
    }
}

module.exports = classHelper;