#!/bin/bash
#获取脚本所在目录
path=$(cd `dirname $0`;pwd)
pwd
echo "Asia/Shanghai" >$path/timezone
echo "mysql容器建立"

#判断data中有没有teach_system数据库，没有就进行初始化数据库的操作
omsCount=$(ls -l $path/env/mysql/data | grep -wc teach_system)
if [ $omsCount == 0 ]; then
    echo "首次安装系统，进行sql初始化,请稍候"
    docker run --name=temp_mysql -itd -p 3306:3306 --privileged=true  -v $path/env/mysql/data:/var/lib/mysql  -v $path/env/mysql/my.cnf:/etc/mysql/my.cnf -v $path/env/mysql/init.sql:/opt/init.sql -e MYSQL_ROOT_PASSWORD=$password mysql:5.7.25
    sleep 20s
    docker exec mysql bash -c "mysql -u root -p$password</opt/init.sql"
    sleep 3s
    docker stop temp_mysql
    docker rm temp_mysql
fi

# 启动自己的
docker-compose up -d