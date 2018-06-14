'use strict'
const ErrorHelper = require('../util/ErrorHelper.js');
class courseHelper{
    static checkGetBaseInfoParam(param){
        let keys = Object.keys(param);
         if(keys.length != 2){
             return ErrorHelper.newError('只能携带c_id,column',406);
         }
         let validParam = ['c_name','code','c_picture','c_intro','teacher_intro','first_course','teach_plan','exam_type','reference_book'];
         if(!validParam.includes(param.column)){
             return ErrorHelper.newError('参数不可用',406);
         }
    }
}
module.exports=courseHelper;