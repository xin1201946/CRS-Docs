---
lang: zh-CN
outline: [1,2,3]
title: Kylin 笔记
---
# **{{ $frontmatter.title }}**

> 该内容所记录的操作均在 已配置镜像源的情况下 进行测试。

## 安全加固

### 账户口令复杂度配置

#### 过程

通过编辑 `/etc/security/pwquality.conf` 文件的以下参数进行配置

>  [!Warning]   
>
> 当字段包含` (负数)`注释时，代表需要将值设置为负值才会生效。

- difok 不得与上册密码相同的字符个数
- minlen 密码最小长度
- dcredit 最少数字个数（负数）
- ucredit 最少大写字母个数（负数）
- lcredit 最少小写字母个数（负数）
- minclass 最少包含多的字符类型
- maxrepeat 相同字符最大出现次数
- usercheck 检查密码是否与用户名相同

#### 实例

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

### 密码生存周期

>  [!Note]
>
> 以下命令`change`测试无效

#### 过程

##### 使用Change命令

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

##### 修改配置文件修改全局设置

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

### FTP

> [!Note]
>
> 以下命令默认已安装镜像源，故并无需插入光盘并手动配置安装源，如果想了解相关过程，可参考 [安装源配置](#安装源配置)

#### 安装FTP

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

####  客户机使用FTP服务

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

   OR

   ```ini
   #APT 追加以下命令
   deb [trusted=yes] file:///[tour-ip]/kylin
   ```

3. 保存，更新缓存

   ```shell
   #yum
   yum clean all && yum makecache && yum -y update
   ```

   OR

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

## NFS 服务

### 安装NFS

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

### 服务端共享目录

#### server节点

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

#### 客户端节点

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



## Docker

> 这里的步骤不要省略！尤其是添加秘钥！
>
> Docker 的官方 并没将Docker添加到各大Linux安装源中，故Linux直接安装Docker可能会出现不信任软件库的情况，需要添加秘钥

### 安装

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

## 编译Python3.6 && 3.7

> 因为 openGauss【 < = V3.0】 官方建议麒麟用户使用自行编译的Python，所以才有了这篇小脚本~
>
> 需要配合稍后更新的《OpenGauss数据库》 那里一起使用

> [!Note]
>
> 即将安装的Python版本分别是
>
> - Python 3.6.15
> - Python 3.7.17
>
> 使用命令 Python36 来使用 Python 3.6 或使用 /usr/bin/python37 来使用 Python 3.7

> [!caution]
>
> 这里的Python编译安装后不会替换自带的Python2，请不要再安装后直接安装OpenGauss数据库！
>
> 自行替换存在风险，请注意备份Python的软连接，稍有不慎就会导致yum，dnf无法使用！

```bash
#!/bin/bash

# 定义 Python 版本
PYTHON_VERSIONS=("3.6.15" "3.7.17")

# 安装 Python 3.6 和 3.7 到指定目录
for VERSION in "${PYTHON_VERSIONS[@]}"; do
    # 下载 Python 源码
    cd /usr/src
    wget https://www.python.org/ftp/python/$VERSION/Python-$VERSION.tgz
    tar xzf Python-$VERSION.tgz
    cd Python-$VERSION

    # 配置并安装 Python
    INSTALL_DIR="/opt/python/$VERSION"
    sudo ./configure --enable-shared --enable-optimizations --prefix=$INSTALL_DIR
    sudo make -j 4
    sudo make altinstall

    # 配置环境变量（全局生效）
    echo "export PATH=$INSTALL_DIR/bin:\$PATH" | sudo tee -a /etc/profile
    echo "export LD_LIBRARY_PATH=$INSTALL_DIR/lib:\$LD_LIBRARY_PATH" | sudo tee -a /etc/profile
    echo "export PYTHONPATH=$INSTALL_DIR/lib/python$VERSION/site-packages:\$PYTHONPATH" | sudo tee -a /etc/profile
    sudo ln -sf $INSTALL_DIR/bin/python$VERSION /usr/bin/python$VERSION
    sudo ln -sf $INSTALL_DIR/bin/pip$VERSION /usr/bin/pip$VERSION

    # 使配置生效
    source /etc/profile

    # 安装 pip 和 psutil
    /usr/bin/python$VERSION -m ensurepip --upgrade
    /usr/bin/python$VERSION -m pip install --upgrade pip
    /usr/bin/python3.6.15 -m pip install psutil
done

# 输出安装信息
echo "安装成功！"
for VERSION in "${PYTHON_VERSIONS[@]}"; do
    echo "Python $VERSION 路径：/opt/python/$VERSION/bin/python$VERSION"
done

echo "--------------------------------------"
echo "使用命令 python3.6 来使用Python3.6。"
echo "使用 python3 或者python3.7 使用Python3.7.17"
echo "--------------------------------------"
echo "| 提示: 需要重新启动系统才能生效 |"
echo "--------------------------------------"

# 确认是否重启系统
read -p "是否重新启动系统以使更改生效？ (y/n): " choice
if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
    echo "正在重启系统..."
    reboot
else
    echo "系统未重启，请手动重启以使更改生效。"
fi

```

> [!Note]
>
> 运行后你可以休息一下，泡杯咖啡~~ 

## OpenGauss数据库  <Badge type="tip" text="待更新" />

### 使用Ansible自动化安装数据库

> [!warning]
>
> root@canfengPC 是客户端PC
>
> root@server 是服务器PC

#### 安装Ansible 

```bash
root@canfengPC# yum install epel-release -y
root@canfengPC# yum install ansible –y
```

#### 配置/etc/ansible/ansible.cfg

```bash
root@canfengPC# grep -v '^#' /etc/ansible/ansible.cfg |sed '/^$/d'
```

随后修改/etc/ansible/ansible.cfg,并按照以下样本添加缺失条目

```ini
[defaults]
host_key_checking = False
callback_whitelist = timer,profile_roles,log_plays
log_path = /var/log/ansible.log
strategy = free
bin_ansible_callbacks = True
[inventory]
[privilege_escalation]
[paramiko_connection]
[ssh_connection]
[persistent_connection]
[accelerate]
[selinux]
[colors]
[diff]
[callback_log_plays]
log_folder=/tmp/ansible/hosts/
```

#### 修改/etc/ansible/hosts添加主机列表

```shell
root@canfengPC# cat /etc/ansible/hosts
```

并对新文件添加内容

{Your_Server_IP} 是你的服务器IP

ansible_ssh_user 是计划让Ansible使用那个账户安装软件（不是管理员会导致后续失败！）

ansible_ssh_pass 是你的指定的账户的密码

```ini
[openGaussdb]
{Your_Server_IP} ansible_ssh_user=root ansible_ssh_pass={Your_Server_PC_Root_Password}
```

#### 测试连通性

```shell
root@canfengPC# ansible -i /etc/ansible/hosts openGaussdb -m ping
```

该命令会在测试成功后输出以下相似内容

```
Thursday 28 November 2024  09:26:29 +0800 (0:00:00.089)       0:00:00.089 ***** 
[WARNING]: Platform linux on host 192.168.128.128 is using the discovered Python interpreter at /usr/bin/python, but future installation of another Python interpreter could change this.
See https://docs.ansible.com/ansible/2.9/reference_appendices/interpreter_discovery.html for more information.
192.168.128.128 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong" # 出现这个表示成功
}
Thursday 28 November 2024  09:26:30 +0800 (0:00:00.900)       0:00:00.989 ***** 
=============================================================================== 
ping -------------------------------------------------------------------- 0.90s
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
total ------------------------------------------------------------------- 0.90s
Playbook run took 0 days, 0 hours, 0 minutes, 0 seconds
```

#### 创建相关目录

> [!warning]
>
> 这里注意看路径变化！

```shell
root@canfengPC ~# cd /etc/ansible/roles/ # 没有自行新建
root@canfengPC:/etc/ansible/roles# mkdir -p openGauss_Install/{files,vars,tasks,templates}
root@canfengPC:/etc/ansible/roles# tree openGauss_Install/  # 存在几率失败，目录存在就行
openGauss_Install/
├── files
├── tasks
├── templates
└── vars

4 directories, 0 files
```

> [!Note]
>
> 上述目录主要作用如下：
> files：存放需要同步到异地服务器的安装文件或者配置文件；
> tasks：openGauss安装过程需要进行的执行的任务；
> templates：用于执行openGauss安装的模板文件，一般为脚本；
> vars：安装openGauss定义的变量；

#### 下载openGauss软件包到files目录

> [!Warning]
>
> 麒麟系统请下载欧拉版本OpenGauss

```shell
root@canfengPC:/etc/ansible/roles# cd openGauss_Install/files/
root@canfengPC:/etc/ansible/roles/openGauss_Install/files#  wget https://opengauss.obs.cn-south-1.myhuaweicloud.com/3.1.0/x86/openGauss-3.1.0-CentOS-64bit-all.tar.gz
root@canfengPC:/etc/ansible/roles# vi /etc/ansible/roles/openGauss_Install/vars/main.yml #这里不调目录直接修改
```

在打开的文件中写入下面内容

```ini
#安装包名称，一定和下载的文件名一致
openGauss_software: openGauss-3.1.0-CentOS-64bit-all.tar.gz
#解压目录
install_dir: /opt/software/openGauss
#omm用户密码，可自己修改
omm_password: openGauss@123 
#数据库密码，可自己修改
db_password: openGauss@123
```

创建安装时需要的xml模板

```shell
root@canfengPC:/etc/ansible/roles# vi /etc/ansible/roles/openGauss_Install/templates/cluster_config.j2
```

填入一下内容,其中将 {{inventory_hostname}} 修改为服务器IP
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <!-- openGauss整体信息 -->
    <CLUSTER>
        <!-- 数据库名称 -->
        <PARAM name="clusterName" value="dbCluster" />
        <!-- 数据库节点名称(hostname) -->
        <PARAM name="nodeNames" value="{{ ansible_hostname }}" />
        <!-- 数据库安装目录-->
        <PARAM name="gaussdbAppPath" value="/opt/huawei/install/app" />
        <!-- 日志目录-->
        <PARAM name="gaussdbLogPath" value="/var/log/omm" />
        <!-- 临时文件目录-->
        <PARAM name="tmpMppdbPath" value="/opt/huawei/tmp" />
        <!-- 数据库工具目录-->
        <PARAM name="gaussdbToolPath" value="/opt/huawei/install/om" />
        <!-- 数据库core文件目录-->
        <PARAM name="corePath" value="/opt/huawei/corefile" />
        <!-- 节点IP，与数据库节点名称列表一一对应 -->
        <PARAM name="backIp1s" value="{{ inventory_hostname }}"/>
    </CLUSTER>
    <!-- 每台服务器上的节点部署信息 -->
    <DEVICELIST>
        <!-- 节点1上的部署信息 -->
        <DEVICE sn="1000001">
            <!-- 节点1的主机名称 -->
            <PARAM name="name" value="{{ ansible_hostname }}"/>
            <!-- 节点1所在的AZ及AZ优先级 -->
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <!-- 节点1的IP，如果服务器只有一个网卡可用，将backIP1和sshIP1配置成同一个IP -->
            <PARAM name="backIp1" value="{{ inventory_hostname }}"/>
            <PARAM name="sshIp1" value="{{ inventory_hostname }}"/>
            <!--dbnode-->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/opt/huawei/install/data/dn01"/>
            <PARAM name="dataNode1_syncNum" value="0"/>
        </DEVICE>
    </DEVICELIST>
</ROOT>
```

#### 创建任务文件

```shell
root@canfengPC:/etc/ansible/roles# vi /etc/ansible/roles/openGauss_Install/tasks/main.yml
```

新建文件后写入下面内容

> [!Warning]
>
> 在 `替换python3版本` 这里注意服务器系统要编译安装Python后安装库psutil,请参照官网使用对应Python版本
>
> 你可以在服务器系统使用 [这个脚本安装](#编译Python3.6 && 3.7) Python环境
>
> 否则要么报错缺少库，要么卡住不动！

```yml
- name: 关闭防火墙
  shell: systemctl disable firewalld.service && systemctl stop firewalld.service
  ignore_errors: true
  tags: 01_os_syscfg
- name: 关闭selinux
  shell: sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
  ignore_errors: true
  tags: 01_os_syscfg
- name: 设置时区
  shell: timedatectl set-timezone Asia/Shanghai
  tags: 01_os_syscfg
- name: 关闭RemoveIPC
  lineinfile:
    path:  /etc/systemd/logind.conf
    state: present
    line: "RemoveIPC=no"
  tags: 01_os_syscfg
- name: 重启systemd-logind服务
  shell: systemctl daemon-reload && systemctl restart systemd-logind
  tags: 01_os_syscfg
- name: 创建组
  group: name=dbgrp gid=2000
  tags: 02_user_add
- name: 创建用户
  user:
    name=omm  uid=2000 group=dbgrp
  tags: 02_user_add
- name: 修改密码
  shell: echo "{{omm_password}}" | passwd --stdin omm
  tags: 02_user_add
- name: 新建目录
  file: path="{{item}}"  state=directory mode=0755 owner=omm group=dbgrp
  with_items:
      - /opt/software/
      - /opt/software/openGauss
  tags: 03_unzip_db
- name: 上传安装包
  copy: src={{openGauss_software}} dest={{install_dir}}  owner=omm group=dbgrp mode=0644
  tags: install
  tags: 03_unzip_db
- name: "解压软件包"
  shell: cd {{install_dir}} && tar -zxvf *all.tar.gz && tar -zxvf *om.tar.gz
  become: yes
  become_user: omm
  tags: 03_unzip_db
- name: "安装依赖包"
  command: yum install -y libaio-devel flex bison ncurses-devel glibc-devel patch bzip2 readline-devel net-tools tar gcc gcc-c++
  tags: 04_os_yum
- name: 检查 python2_bak 是否存在
  stat:
    path: /usr/bin/python2_bak
  register: python2_bak_stat
  tags: 05_replace_ok

- name: 替换 python3 版本
  shell: |
    {% if python2_bak_stat.stat.exists == false %}
      mv /usr/bin/python /usr/bin/python2_bak
    {% endif %}
    ln -s /usr/bin/python3 /usr/bin/python && python -V
  tags: 05_replace_py

- name: 配置xml文件
  template: src=cluster_config.j2 dest={{install_dir}}/clusterconfig.xml
  tags: 06_config_xml
- name: 执行预安装脚本
  shell: '{{install_dir}}/script/gs_preinstall -U omm -G dbgrp -X {{install_dir}}/clusterconfig.xml --non-interactive'
  register: preinstall
  tags: 07_pre_install
- debug: var=preinstall.stdout_lines
  ignore_errors: true
  tags: 07_pre_install
- name: 检查预安装环境
  shell: '{{install_dir}}/script/gs_checkos -i A -h {{ ansible_hostname }} --detail'
  register: checkos
  tags: 08_check_os
- debug: var=checkos.stdout_lines
  ignore_errors: true
  tags: 08_check_os
- name: 更改权限
  shell: chmod -R 755 {{install_dir}}
  tags: 09_gs_install
- name: 执行gs_install
  shell: su - omm -c '{{install_dir}}/script/gs_install -X {{install_dir}}/clusterconfig.xml --gsinit-parameter="--pwpasswd={{db_password}}"''
  register: gsinstall
  tags: 09_gs_install
- debug: var=gsinstall.stdout_lines
  ignore_errors: true
  tags: 09_gs_install
- name: 启动数据库
  shell: ss -anpt|grep 26000 && su - omm -c "gs_ctl restart " || su - omm -c "gs_om -t start "
  tags: 10_db_start
- name: "登录数据库"
  shell: ss -anpt|grep 26000 && su - omm -c "gsql -d postgres -p26000 -r -l"
  tags: 10_db_start
```

#### 创建剧本调用文件

```shell
root@canfengPC:/etc/ansible/roles# vi /etc/ansible/playbook/InstallopenGauss.yml 
```

写入以下文本

```yml
- name: Install openGauss
  hosts: openGaussdb
  remote_user: root
  roles:
  - openGauss_Install
```

#### 校验语法（测试安装过程）

```shell
root@canfengPC:~# ansible-playbook -C /etc/ansible/playbook/InstallopenGauss.yml
```

如果成功，你会看到 最底下 failed的值为0

#### 开始正式安装

```shell
root@canfengPC:~# ansible-playbook /etc/ansible/playbook/InstallopenGauss.yml
```

安装时间很长，需要等待ing...

#### 安装完成后验证

> [!Note] 完成！
>
> 你终于用到你的服务器啦，登录你的omm账户

```shell
omm@server:~$ gsql -d postgres -p26000
```

> [!Note] ✨完结撒花🎉
>
> 至此，整个自动化部署openGauss完毕，如果有多台机器需要部署，添加主机相关信息到/etc/ansible/hosts，再执行ansible-playbook即可。😎👍

### 排错

> 上面确实是正确的安装做法，但是在实际安装中，仍然会遇到很多错误。

#### 缺少库

解决办法就是：系统中其实存在对应库，但是要求的版本过低，不受支持，你需要前往/usr/lib64 OR /usr/lib/ 查找和名字名字一样但是版本不一样的so库，创建一个链接，名字改成程序要求的版本即可.

#### 架构一致，不知道为什么报错

> 这个体现在麒麟系统居多

解决办法就是修改 `/opt/software/opengauss/script/gspylib/common/CheckPythonVersion.py` 文件的 `check_os_and_package_arch()`函数。把在68行附近的IF语句，注释掉

#### 预安装命令执行时卡住，没有输出内容

添加 `--unused-third-party` 可选项

#### 报错[GAUSS-50201] : 找不到.bz2文件

回到服务器的OpenGauss目录把压缩包修改成他想要的格式就行。

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