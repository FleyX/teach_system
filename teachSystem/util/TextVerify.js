class TextVerify {
  //6-20位字母数字组合
  static isPassword(str = null) {
    if (str == null) {
      return false;
    }
    var reg = /^[\w]{6,20}$/;
    return reg.test(str);
  }

  //电子邮件地址
  static isEmail(str = null) {
    if (str == null) {
      return false;
    }
    var reg = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
    return reg.test(str);
  }

  //手机号
  static isMobile(str = null) {
    if (str == null) {
      return false;
    }
    var reg = /^1\d{10}$/;
    return reg.test(str);
  }
}

module.exports = TextVerify;
