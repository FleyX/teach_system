#!/bin/bash
#获取脚本所在目录
path=$(cd `dirname $0`;pwd)

echo "Asia/Shanghai" >$path/timezone


#mysql数据密码
password=123456



echo "mysql容器建立"
docker run --name=mysql -itd -p 3306:3306 --privileged=true  -v /etc/localtime:/etc/localtime  -v $path/timezone:/etc/timezone  -v $path/data:/var/lib/mysql  -v $path/my.cnf:/etc/mysql/my.cnf -v $path/init.sql:/opt/init.sql -e MYSQL_ROOT_PASSWORD=$password mysql:5.7.25

#判断data中有没有teach_system数据库，没有就进行初始化数据库的操作
omsCount=$(ls -l $path/data | grep -wc teach_system)
if [ $omsCount == 0 ]; then
    echo "首次安装系统，进行sql初始化,请稍候"
    sleep 20s
    docker exec mysql bash -c "mysql -u root -p$password</opt/init.sql"
fi
