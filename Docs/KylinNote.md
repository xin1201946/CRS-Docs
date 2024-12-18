---
lang: zh-CN
outline: [1,2,3]
title: Kylin 课后题总结
---

# 前言

Kylin是由我国基于Linux内核完全自主研发的，支持全平台（X86_64, ARM, MIPS）的操作系统。具有开源免费，易于使用支持多种文件系统，安全可靠，支持PXE批量部署的优点。Kylin系统内置WPS和VLC工具。

而Kylin Server是我国基于Centos研发，支持全平台，优点一样。

# Kylin系统之间的区别

| 系统         | 文件格式 | 包管理工具 |
| ------------ | -------- | ---------- |
| Kylin        | EXT4     | APT        |
| Kylin-Server | XFS      | YUM        |

# Kylin操作

## 查看日志

```shell 
journalctl
```

## 查看进程信息

```shell 
ps
```

## 修改文件默认权限

```shell 
umask
```

## 定时任务

```shell 
crontab
```

## 管理系统服务

```shell 
chkconfig
```

## 查看开放端口

```shell 
netstat -a
```

## 配置防火墙

```shell 
iptables
```

查看日志

```shell 
journalctl
```

### 磁盘使用情况

```shell 
df -h
```

## 磁盘阵列

```shell 
mdadm -D
```

# 常用端口

Tomcat： 8080

Apache：80

Nginx： 80

Kylin默认管理端口： 7070



# ISCSI

## 简要

ISCSI 存储服务是一种在IP网络上传输`SCSI（Small Computer System Interface）`命令和数据的存储协议。它允许将远程存储设备映射到本地主机，提供了一种基于网络的存储解决方案并可提供块存储服务。

##  ISCSI存储服务状态

```shell 
iscsiadm -m session
```



# Virsh

## KVM

在kvm中，依赖宿主机内核的虚拟机类型为 全虚拟化

## 查看虚拟化平台状态

```shell 
virsh version
```

# Apache（Httpd）

Apache在Linux中为httpd软件包，是一个web服务器。默认端口为80，配置文件为httpd.conf 

# RAID

## 简要

RAID （ Redundant Array of Independent Disks ）即独立磁盘冗余阵列，简称为「磁盘阵列」，其实就是用多个独立的磁盘组成在一起形成一个大的磁盘系统，从而实现比单块磁盘更好的存储性能和更高的可靠性。

## 命令

#### 创建RAID1磁盘阵列

```shell 
mdadm -C
```



## 类型区别

| **RAID 类型**    | **所需磁盘数** | **特点**                                                  | **优缺点**                                                   | **适用场景**                           |
| ---------------- | -------------- | --------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| **RAID 0**       | 至少 2 个      | 数据条带化，没有冗余，速度较快。                          | **优点**: 高性能；**缺点**: 无冗余，数据丢失风险高。         | 高速存储需求，不关心数据丢失风险。     |
| **RAID 1**       | 至少 2 个      | 镜像，数据完全复制到两个硬盘上，提供冗余保护。            | **优点**: 高数据冗余，读取速度较快；**缺点**: 存储效率低（50%）。 | 数据冗余要求高，数据安全至关重要。     |
| **RAID 5**       | 至少 3 个      | 数据和奇偶校验信息分布在多个硬盘上，提供较好的冗余保护。  | **优点**: 高效的存储、容错；**缺点**: 写入性能稍差，重建时间长。 | 平衡性能、存储和冗余的场景。           |
| **RAID 6**       | 至少 4 个      | 类似RAID 5，但有两个奇偶校验块，能容忍两个硬盘同时故障。  | **优点**: 更高冗余，容忍更多硬盘故障；**缺点**: 存储效率低，性能较差。 | 高冗余、数据安全要求极高的环境。       |
| **RAID 10**(1+0) | 至少 4 个      | RAID 1 + RAID 0 结合，镜像 + 条带化，提供高性能和高冗余。 | **优点**: 高性能，高冗余；**缺点**: 存储效率低（50%）。      | 需要高性能和高冗余的场景（如数据库）。 |
| **RAID 50**(5+0) | 至少 6 个      | RAID 5 + RAID 0 结合，提供更高性能和冗余性。              | **优点**: 高性能，较好的冗余；**缺点**: 存储效率低，复杂度高。 | 性能和冗余要求高的环境。               |
| **RAID 60**(6+0) | 至少 8 个      | RAID 6 + RAID 0 结合，提供极高冗余性和性能。              | **优点**: 高冗余，性能优；**缺点**: 存储效率更低，管理复杂。 | 极高冗余性和数据保护的场景。           |

# PXE

全称preboot execute environment，用于部署安装服务器，之后可在客户机集群批量部署系统。在安装时，客户端需要获取安装服务器的IP，掩码，和网关来与安装服务器通信，

# Docker

## 前言

Docker是一个使用容器技术的虚拟机平台，与其他虚拟机不同的是他不需要模拟内核，硬件，大大减少内存，CPU占用，大幅度提升稳定性。其中，我们常用的Docker容器管理软件 - Docker Compose就是专门创建和管理容器的软件

## 常用命令

### 创建容器

```shell 
docker create 
```

### 启动容器

```shell 
docker start
```

### 停止容器

```shell 
docker stop
```

### 拉取容器镜像

```shell 
docker pull
```

### 列出所有可用镜像

```shell 
docker images
```



## Dockerfile文件

WORKDIR  : 设置工作目录

service : 定义服务

ENV：定义环境变量

ADD：用于复制文件获目录到容器中

# Kickstart

## 前言

一种红帽企业为了满足用户实现使用自动化安装方法的工具，只需要一个配置文件就可以实现配置多台客户机集群。

kickstart文件是一个简单的文本文件，可使用Anaconda工具生成，也可自行编写。

## kickstart的常见操作

%packages命令来列出想安装的软件包

hostname用于设置主机名

## 注意事项

​		1.每节必须按顺序指定，但并不是必须包含所有命令
    2.不必需的项目可以被省略. 
    3.如果忽略任何必需的项目,安装程序会提示用户输入相关的项目的选择,就象用户在典型的安装过程中所遇到的一样.一旦用户进行了选择,安装会以非交互的方式(unattended)继续(除非找到另外一个没有指定的项目). 
    4.以井号(“#”)开头的行被当作注释行并被忽略.

