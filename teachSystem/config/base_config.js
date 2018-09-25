const path = require('path');
const rootPath = path.dirname(__dirname);
const default_env = ["LANG=en_US.UTF-8", "LANGUAGE=en_US:en", "LC_ALL=en_US.UTF-8"]

module.exports = {
    //当前项目根目录
    rootPath: rootPath,
    //日志配置
    log: {
        appenders: {
            visit: {
                type: 'file',
                filename: path.join(rootPath, 'log/visit/visit.log'),
                "maxLogSize": 104800,
                "backups": 100
            },
            operate: {
                type: 'file',
                filename: path.join(rootPath, 'log/operate/operate.log'),
                "maxLogSize": 104800,
                "backups": 100
            },
            responseTime: {
                type: 'file',
                filename: path.join(rootPath, 'log/responseTime/response_time.log'),
                "maxLogSize": 104800,
                "backups": 100
            }
        },
        categories: {
            default: {
                appenders: ['visit'],
                level: 'all'
            },
            visit: {
                appenders: ['visit'],
                level: 'all'
            },
            operate: {
                appenders: ['operate'],
                level: 'all'
            },
            responseTime: {
                appenders: ['responseTime'],
                level: 'all'
            }
        },
        replaceConsole: false,
    },
    //url前缀
    url_prefix: process.env.url_prefix == null ? '/api/v1' : process.env.url_prefix,
    //请求表单限制
    bodyLimit: {
        formLimit: '2mb',
        urlencoded: true,
        multipart: true,
        formidable: {
            uploadDir: path.join(rootPath, 'files', 'temp', 'uploads'),
            keepExtenstions: true,
            maxFieldsSize: 1024 * 1024,
        },
    },
    //记住我token有效期
    longTokenExpiration: 20 * 24 * 60 * 60,
    //不记住我token有效期
    shortTokenExpiration: 60 * 60,
    //邮箱配置
    mail: {
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    },
    //知识点是否掌握判断标准：答题数>=num，正确率>=percent
    coverage: {
        num: 5,
        percent: 0.8
    },
    env: process.env.NODE_ENV,
    //静态资源存储目录
    staticPath: path.join(rootPath, 'files'),
    //代码存储目录
    codeSavePath: path.join(rootPath, 'files', 'code'),
    //编程题判题参数
    programConfig: {
        c: {
            compile: {
                "src_name": "main.c",
                "exe_name": "main",
                "max_cpu_time": 3000,
                "max_real_time": 5000,
                "max_memory": 128 * 1024 * 1024,
                "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c99 {src_path} -lm -o {exe_path}",
            },
            run: {
                "command": "{exe_path}",
                "seccomp_rule": "c_cpp",
                "env": default_env
            }
        },
        cpp: {
            compile: {
                "src_name": "main.cpp",
                "exe_name": "main",
                "max_cpu_time": 3000,
                "max_real_time": 5000,
                "max_memory": 128 * 1024 * 1024,
                "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++11 {src_path} -lm -o {exe_path}",
            },
            run: {
                "command": "{exe_path}",
                "seccomp_rule": "c_cpp",
                "env": default_env
            }
        },
        java: {
            "name": "java",
            "compile": {
                "src_name": "Main.java",
                "exe_name": "Main",
                "max_cpu_time": 3000,
                "max_real_time": 5000,
                "max_memory": -1,
                "compile_command": "/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8"
            },
            "run": {
                "command": "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true Main",
                "seccomp_rule": null,
                "env": default_env,
                "memory_limit_check_only": 1
            }
        },
        py2: {
            "compile": {
                "src_name": "solution.py",
                "exe_name": "solution.pyc",
                "max_cpu_time": 3000,
                "max_real_time": 5000,
                "max_memory": 128 * 1024 * 1024,
                "compile_command": "/usr/bin/python -m py_compile {src_path}",
            },
            "run": {
                "command": "/usr/bin/python {exe_path}",
                "seccomp_rule": "general",
                "env": default_env
            }
        },
        py3: {
            "compile": {
                "src_name": "solution.py",
                "exe_name": "__pycache__/solution.cpython-35.pyc",
                "max_cpu_time": 3000,
                "max_real_time": 5000,
                "max_memory": 128 * 1024 * 1024,
                "compile_command": "/usr/bin/python3 -m py_compile {src_path}",
            },
            "run": {
                "command": "/usr/bin/python3 {exe_path}",
                "seccomp_rule": "general",
                "env": ["PYTHONIOENCODING=UTF-8", ...default_env]
            }
        }
    }
}