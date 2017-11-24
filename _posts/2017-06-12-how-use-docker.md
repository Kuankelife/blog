---
layout: post
title: docker 入门与安装
date: 2017-06-12
header-img: "img/home-bg.jpg"
tags:
     - docker
author: '老付'
---    


### Docker的概念

#### 什么是Docker      
  Docker是一个开源的引擎，可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器。开发者在笔记本上编译测试通过的容器可以批量地在生产环境中部署，包括VMs（虚拟机）、bare metal、OpenStack 集群和其他的基础应用平台。




#### Docker的优势         
  
 对于开发和运维来说,把程序部署到生产的时候，最常见的问题是环境问题,由于服务器单机的差异,可能会导致问题比较众多烦杂。对于这个问题,docker的优势就可以体现出来了。我们假设一个系统有四个要素组成：应用app,app依赖的类库,配置文件和系统环境。 


  - 对于传统的部署    

  我们需要对以上个因素进行单独的考虑和配置,如果集群则面临了大量的工作量,如果使用虚拟机的快照，也过于庞大       

  - docker部署 docker本身是跨平台，镜像中包含应用程序中所需要的类库和环境，一次生成多处运行。即使不跨平台的语言，只要能够运行在docker容器中，就能够实现跨平台。


### Docker 安装与使用    

#### Docker的安装      

  对于docker的安装可以使用以下命令：      

  ``` bash     

  $ sudo apt-get install docker

  ```      
  安装完成后,执行     

  ``` bash     

  $ docker version

  ```      

  执行结果如下：    

  ``` bash     
  Client version: 1.6.2
  Client API version: 1.18
  Go version (client): go1.5.1
  Git commit (client): 7c8fca2
  OS/Arch (client): linux/amd64

  Server version: 1.6.2
  Server API version: 1.18
  Go version (server): go1.5.1
  Git commit (server): 7c8fca2
  OS/Arch (server): linux/amd64

  ```    

 如果有以上结果说明docker 已经安装成功    

 **碰到问题：**
   connect: permission denied. Are you trying to connect to a TLS-enabled daemon without TLS  

  **原因：** 是因为当前的用户没有权限导致，把当前用户添加到docker用户组即可      

  **解决办法：**   执行以下命令：     

  ``` bash     
  $ sudo gpasswd -a ${USER} docker   # 把当前用户添加到docker组

  $ groups     # 检查没有没添加到当前用户组

  $ sudo service docker.io restart  # 重启

  ```  
  

#### Docker的使用     

 对于docker的使用可以参考[官方文档](https://docs.docker.com/engine/reference/builder/){:target="_blank"} ,也可以通过执行docker --help命令来查看常用命令的使用。下面演示如何从服务器上面下载项目,docker有一个[官方](https://hub.docker.com/){:target="_blank"}的镜像服务器，但访问速度非常慢，个人建议使用[网易镜像](https://c.163.com/hub#/m/home/){:target="_blank"}速度比较快。

  1. 使用docker pull 下载hello-world项目   

	   ``` bash     

	    $ docker pull hub.c.163.com/library/hello-world:latest
	 
	   ```         

  2. 使用docker images查看本地有哪些镜像     

	   ``` bash     

	   REPOSITORY                          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
	   hub.c.163.com/library/hello-world   latest              7a5a2d73abce        4 months ago        1.84 kB


	   ```        

  3. docker run 运行镜像    

	  ```  bash      

	  $ docker run hub.c.163.com/library/hello-world


	  ```       

     运行结果：      


      ![dockerRun](/img/assets/dockerRun.png)       


  4. 删除docker容器          

     ```  bash     

     $ docker rmi -f hub.c.163.com/library/hello-world


     ```   







