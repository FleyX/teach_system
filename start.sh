#!/bin/bash

# mysql root密码通过环境变量配置
#export MYSQL_PASS=123456
# 判题服务密钥通过环境变量配置
#export JUDGE_TOKEN=12345678

#获取脚本所在目录
path=$(cd `dirname $0`;pwd)
pwd
echo "Asia/Shanghai" >$path/timezone
echo "mysql容器建立"

#判断data中有没有teach_system数据库，没有就进行初始化数据库的操作
omsCount=$(ls -l $path/files/mysql/data | grep -wc teach_system)
if [ $omsCount == 0 ]; then
    echo "首次安装系统，进行sql初始化,请稍候,需等候一分钟左右"
    docker stop temp_mysql
    docker rm temp_mysql
    docker run --name=temp_mysql -itd -p 3306:3306 --privileged=true  -v $path/files/mysql/data:/var/lib/mysql  -v $path/files/mysql/my.cnf:/etc/mysql/my.cnf -v $path/files/mysql/init.sql:/opt/init.sql -e MYSQL_ROOT_PASSWORD=$MYSQL_PASS mysql:5.7.25
    sleep 50s
    docker exec temp_mysql bash -c "mysql -u root -p$MYSQL_PASS</opt/init.sql"
    sleep 3s
    docker stop temp_mysql
    docker rm temp_mysql
fi

docker-compose up -d
