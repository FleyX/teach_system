# 概述
&emsp;&emsp;本仓库用于存放毕业设计代码，同时也给想要使用node.js，vue.js构建系统的同志做个参考。。。
判题使用的是青岛大学的判题核心，[https://github.com/QingdaoU/JudgeServer](https://github.com/QingdaoU/JudgeServer)
判重使用SIM实现，[地址](https://dickgrune.com/Programs/similarity_tester/)

# 安装

&emsp;&emsp;脚本只包含了本系统的一键部署，并未包涵判题系统的部署，如需要判题，请自行依照文档进行部署。

&emsp;&emsp;由于使用docker部署，故只支持linux部署.首先请安装好docker。然后进入到teach_system/docker目录下，执行start.sh脚本，等待一段时间即可安装完毕。

**PS:如果docker pull 镜像速度很慢，请给docker设置国内加速地址。**

&emsp;&emsp;默认访问端口为80.

# 主要界面如下：

## 管理端界面
1. 登录
![登录界面](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217124740.png)

2. 管理端主界面

![管理端主界面](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125012.png)

3. 管理端个人中心

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125100.png)

4. 课程管理

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125136.png)

5. 课程信息管理

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125221.png)

6. 课程公告管理

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125517.png)


## 学生端界面

1. 主界面

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125658.png)

2. 课程界面

![](https://raw.githubusercontent.com/FleyX/files/master/teachSystem/20190217125815.png)