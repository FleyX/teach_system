const ErrorHelper = require('../util/ErrorHelper.js');
class questionGroupHelper{
    static getParam(params){
        try{
            params= JSON.parse(new Buffer(params.data,'base64').toString());
        }catch(err){
            ErrorHelper.Error400("参数不合法:");
        }
        return params;
    }
}

module.exports=questionGroupHelper;