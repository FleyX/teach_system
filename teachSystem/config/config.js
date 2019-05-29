const path = require("path");
const rootPath = path.dirname(__dirname);
const judgeConfig = require("./judgeConfig.js");
let crypto = require("crypto");

module.exports = {
  //当前项目根目录
  rootPath: rootPath,
  //日志配置
  log: {
    appenders: {
      visit: {
        type: "file",
        filename: path.join(rootPath, "log/visit/visit.log"),
        maxLogSize: 104800,
        backups: 100
      },
      operate: {
        type: "file",
        filename: path.join(rootPath, "log/operate/operate.log"),
        maxLogSize: 104800,
        backups: 100
      },
      responseTime: {
        type: "file",
        filename: path.join(rootPath, "log/responseTime/response_time.log"),
        maxLogSize: 104800,
        backups: 100
      }
    },
    categories: {
      default: {
        appenders: ["visit"],
        level: "all"
      },
      visit: {
        appenders: ["visit"],
        level: "all"
      },
      operate: {
        appenders: ["operate"],
        level: "all"
      },
      responseTime: {
        appenders: ["responseTime"],
        level: "all"
      }
    },
    replaceConsole: false
  },
  //url前缀
  url_prefix: process.env.url_prefix == null ? "/api/v1" : process.env.url_prefix,
  //请求表单限制
  bodyLimit: {
    formLimit: "2mb",
    urlencoded: true,
    multipart: true,
    formidable: {
      uploadDir: path.join(rootPath, "files", "temp", "uploads"),
      keepExtenstions: true,
      maxFieldsSize: 1024 * 1024
    }
  },
  //记住我token有效期
  longTokenExpiration: 20 * 24 * 60 * 60,
  //不记住我token有效期
  shortTokenExpiration: 60 * 60,
  //邮箱配置
  mail: {
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
      user: "",
      pass: ""
    }
  },
  //知识点是否掌握判断标准：答题数>=num，正确率>=percent
  coverage: {
    num: 5,
    percent: 0.8
  },
  env: process.env.NODE_ENV,
  //静态资源存储目录
  staticPath: path.join(rootPath, "files"),
  //代码存储目录
  codeSavePath: path.join(rootPath, "files", "code"),
  redis: {
    host: process.env.redisHost || "localhost",
    prot: 6379
  },
  mysql: {
    connectionLimit: 50, //默认值10
    host: process.env.mysqlHost || "localhost",
    user: "root",
    password: process.env.mysqlPassword || "123456",
    database: "teach_system",
    multipleStatements: false //默认值false
  },
  //静态文件访问路径
  host: "/files",
  //端口
  port: process.env.port || 8088,
  //判题接口
  judgeUrl: process.env.judgeUrl || "http://localhost:12358/judge",
  //判题token
  judgeToken: crypto
    .createHash("SHA256")
    .update(process.env.judgeToken || "12345678")
    .digest("hex"),
  //测试用例存储路径
  testSavePath: process.env.testSavePath || path.join(rootPath, "files", "tests"),
  //编程题判题参数
  programConfig: judgeConfig
};
