---
lang: zh-CN
outline: [1,2,3]
---

> > 该内容所记录的操作均在 已配置镜像源的情况下 进行测试。

# 安全加固

## 账户口令复杂度配置

### 过程

通过编辑 `/etc/security/pwquality.conf` 文件的以下参数进行配置

>  [!Warning]   
>
> 当字段包含` (负数)` 注释时，代表需要将值设置为负值才会生效。

- difok 不得与上册密码相同的字符个数
- minlen 密码最小长度
- dcredit 最少数字个数（负数）
- ucredit 最少大写字母个数（负数）
- lcredit 最少小写字母个数（负数）
- minclass 最少包含多的字符类型
- maxrepeat 相同字符最大出现次数
- usercheck 检查密码是否与用户名相同

### 实例

当设置控制用户的密码至少包含2个数字，2个大写字母，无需小写字母，至少4个特殊字符，密码包含1种字符类型时，代码如下：

```ini
# 此选项表示最小长度
minlen = 8
# 至少2个数字
dcredit = -1
# 至少2个大写字母
ucredit = -2
# 无需小写字母
lcredit = 0
# 至少4个特殊字符
ocredit = -4
# 至少5种字符类型
minclass = 5
```

## 密码生存周期

>  [!Note]
>
> 以下命令`change`测试无效

### 过程

#### 使用Change命令

你可以使用`change`命令对**<u>指定用户</u>**的密码周期进行修改

例如：

设置用户密码有效期90天

```bash
change -M 90 canfengs
```



设置用户最短有效期1天

```shell
change -m 1 canfengs
```



设置过期前3天提醒用户

```shell
change -W 3 canfegs
```

#### 修改配置文件修改全局设置

> [!Note]
>
> 改配置文件全局有效！

文件路径位于 `/etc/login.defs`

可通过以下参数进行修改：

```shell
[root@canfeng-pc ~]# vi /etc/login.defs
#密码有效期90天
PASS_MAX_DAYS 90
#最短有效期1天
PASS_MIN_DAYS 1
#过期前3天提醒用户
PASS_WARN_AGE 3
```

# FTP

> [!Note]
>
> 以下命令默认已安装镜像源，故并无需插入光盘并手动配置安装源，如果想了解相关过程，可参考 [安装源配置](#安装源配置)

### 安装FTP

1. 安装FTP服务

   ```shell
   sudo yum install vsftpd -y
   ```

   

2. 编辑配置文件

   ```shell
   sudo vi /etc/vsftpd.conf
   ```

   修改一下配置：

   ```[ini]
   #匿名用户登录后的主目录为 /opt
   anon_root = /opt
   #允许匿名用户登录FTP服务器
   anonymous_enable = YES

3. 启动FTP服务

   ```shell
   systemctl start vsftpd
   systemctl enable vsftpd
   ```

4. 关闭防火墙和SeLinux

   ```shell
   setenforce 0
   systemctl stop firewalld
   ```

###  客户机使用FTP服务

   > [!warning]
   >
   > 在配置FTP时，你可能会注意到不存在kylin文件夹。我并未测试过FTP作为安装源，但是如果你没有kylin文件夹，该文件夹下也没有对应软件包的话，你会100%失败！

> [!CAUTION]
>
> rm -rf 是十分危险的命令，且在删除该文件/文件夹后无法恢复，请谨慎操作。及时备份数据！



1. 配置Yum（Kylin新版本为APT，按照你的包管理器进行选择）

   ```shell
   #如果你是Yum
   rm -rf /etc/yum.repos.d/*
   vi /etc/yum.repos.d/http.repo
   #如果你是APT
   vi /etc/apt/sources.list
   ```

2. 修改内容

   ```ini
   #yum写入以下配置：
   [kylin-http]
   name=kylin-http
   baseurl=ftp://[your-ip]/kylin
   gpgcheck=0
   ```

   AND

   ```ini
   #APT 追加以下命令
   deb [trusted=yes] file:///[tour-ip]/kylin
   ```

3. 保存，更新缓存

   ```shell
   #yum
   yum clean all && yum makecache && yum -y update
   ```

   AND

   ```shell
   #APT
   apt update && apt upgrade
   ```

4. 安装软件

   ```shell
   yum install mariadb-server mariadb -y
   #or
   apt install mariadb-server mariadb
   ```

# NFS 服务

## 安装NFS

> [!Note]
>
> 服务器和客户机都需安装 nfs-utils

```shell
yum -y install nfs-utils
systemctl start rpcbind          #先启动rpc服务
systemctl enable rpcbind      #设置开机启动
systemctl start nfs
systemctl enable nfs
systemctl status nfs
```

## 服务端共享目录

### server节点

> 必须全程关闭 Selinux和防火墙

```shell
groupadd nfsgroup
useradd nfs -g nfsgroup
id nfs
# 记住用户id和组id
mkdir /opt/test
mkdir /opt/t
vi /etc/exports
#添加以下内容
/opt/test [网段IP/24](ro)
/opt/t *(rw,all_squash,anonuid=1003,anongid=1002)
#比如 /opt/test 192.168.111.0/24(rw)
#保存并退出后执行
exportfs -r
```

解释：

- 网段可为*，监听全局IP有效
- /opt/test 共享目录
- rw 可读写
- ro 可读
- sync 同时写入磁盘和内存
- async 暂存内存，而不是直接写入磁盘
- no_root_squash 如果客户端使用Root链接服务端，此时客户端对于该共享文件也存有Root权限
-  如果客户端使用Root链接服务端，此时客户端对于该共享文件将存有匿名权限
- all_squash 客户端永远都是匿名权限
- anonuid 匿名用户UID
- anongid 匿名用户GID

启动NFS服务

```shell
systemctl start nfs
setenforce 0
systemctl stop firewall
chmod 777 /opt/test/
```

查看共享的目录

```shell
showmount -e [Server-IP]
```

### 客户端节点

关闭防火墙和Selinux

```shell
sudo apt install nfs-kernel-server
setenforce 0
systemctl stop firewalld
```

使用NFS 挂载共享目录

```shell
mount -t nfs [服务器IP]:/opt/test /mnt
```

查看挂载情况

```shell
df -h
# 存在已IP开头的文件系统既为挂载成功
```



# Docker

> 这里的步骤不要省略！尤其是添加秘钥！
>
> Docker 的官方 并没将Docker添加到各大Linux安装源中，故Linux直接安装Docker可能会出现不信任软件库的情况，需要添加秘钥

## 安装

> [!Note]
>
> 你需要知道你当前Linux基于那个Linux发行版进行构建，一般服务器Linux基于 Centos，而桌面版Linux基于Ubuntu，实在不确定可看下包管理器，yum是Centos的包管理器，apt则是Ubuntu的包管理器

> [!Warning]
>
> 你需要自行查看Docker官方针对你的Linux和架构设计的[安装步骤](https://docs.docker.com/engine/install/),这里以Centos为例

1. 设置存储库
```shell
$ sudo yum-config-manager -add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

2. 安装Docker·CE
```shell
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 启动Docker

   ```
   systemctl start docker
   systemctl enable docker
   ```

4. 使用Docker创建Nginx容器`nginx-01`,并分配`2`个CPU核心和`8`GB内存

   > [!note]
   >
   > 不出意外的话这里估计要出点意外，你会发现下载出奇的慢，除非你在国外。所以你需要设置镜像源(考试的时候你可以不设置，你知道就行)。

   > Docker 添加加速地址
   > 加速地址1：`https://dockerproxy.1panel.live `
   >
   > 加速地址2：`https://docker.1panel.live`
   >
   > 加速地址3：`https://proxy.1panel.live`

   ```shell
   #修改 /etc/docker/daemon.json (不存在的话也正常，你就继续写就行)
   sudo tee /etc/docker/daemon.json <<-'EOF'
   {
       "registry-mirrors": [
       	"https://dockerproxy.1panel.live",
           "https://proxy.1panel.live",
           "https://docker.1panel.live"
       ]
   }
   EOF
   sudo systemctl daemon-reload && sudo systemctl restart docker # 重启Docker服务
   ```

   

   ```shell
   docker run --name nginx-01 -d -p 80:80 -m 8g --cpus=2 nginx
   ```

   > [!note]
   >
   > - --name 指定容器名
   > - -p 映射主机端口:容器内部端口 。将内部端口映射到主机的映射主机端口
   > - -m 指定内存
   > - --cpus 指定cpu核心数
   > - nginx 指定Docker将Nginx作为母容器制作nginx-01 容器

# 编译Python3.6

```shell
cd /usr/src
wget https://www.python.org/ftp/python/3.6.15/Python-3.6.15.tgz
tar xzf Python-3.6.15.tgz
cd Python-3.6.15
./configure --enable-shared --enable-optimizations
make altinstall
find /usr -name "libpython3.6m.so.1.0"
echo 'export LD_LIBRARY_PATH=/usr/src/Python-3.6.15:$LD_LIBRARY_PATH' | sudo tee -a /etc/profile
echo 'LD_LIBRARY_PATH="/usr/src/Python-3.6.15:$LD_LIBRARY_PATH"' | sudo tee -a /etc/environment
source /etc/environment
source /etc/profile
which python3.6
sudo ln -sf /usr/local/bin/python3.6 /usr/bin/python36
python36 -m pip install --updgrade pip
python36 -m pip install  psutil
reboot

```



# 安装源配置

> 配置安装源是Linux在正式使用前必做的设置，因为服务器常在国外，故如果不配置[镜像源](#常见镜像源)会导致下载过慢，甚至失败。

> [!Note]
>
> 请在配置前 弄清自己的``Linux版本``,``代号`` 和 `包管理器`。

常见的包管理器有`apt` ,`yum`和`dnf`等,这里仅涉及到`apt`和`yum`. 请在以下镜像源搜索自己的Linux版本,并根据代号找到合适的APT源 URL,并根据下面的修改方式进行修改.

## 常见镜像源

清华源
https://mirrors.tuna.tsinghua.edu.cn/

阿里源
https://mirrors.tuna.tsinghua.edu.cn/

网易163
http://mirrors.163.com/

中国科学技术大学
https://mirrors.bfsu.edu.cn

本地源

请在插入CD后,将其挂载,并进行以下操作配置:

```
mount Kylin-Server-10-SP2-Release-Build09-20210524-x86_64.iso /opt/kylin
```



- apt 源:

  - 进入source.list 后 添加 

    ```ini
    deb [trusted=yes]  file:///opt/kylin
    ```

    

- Yum源:

  - 进入repo 文件后添加以下文本:

    ```ini
    #以Kylin为例
    [kylin] 
    name=kylin 
    baseurl=file:///opt/kylin
    gpgcheck=0
    enabled=1
    ```

    

## APT包管理器

可在 `/etc/apt/sources.list`中进行配置

## YUM包管理器

可在`/etc/yum.repos.d/[系统名/代号].repo` 中进行配置