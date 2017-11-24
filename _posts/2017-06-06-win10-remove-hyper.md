---
layout: post
title: win10移除Hyper
date: 2017-06-06
header-img: "img/home-bg.jpg"
tags:
     - win10
author: '老付'
---      


### win10碰到的问题       
   
   win10 自带的Hyper与Vmare冲突,使用控制面板去除Hyper之后,win10会自动更新把Hyper又重新安装上了。。。经历几次折腾最终还是不行。原因：Hyper-V后VMware都要独占基于CPU等底层硬件的 Hypervisor才能运行，所以二者不能在同一台电脑中同时运行

 
### 修改启动项      
  
1. 以管理员身份运行命令提示符      

2. 在命令提示符窗口中输入以下命令     

	  ``` bash    

	   bcdedit /copy {current} /d "Windows 10 (关闭 Hyper-V)"    

	  ```       


   运行后会提示你已经创建了另外一个启动菜单项，记下 { } 中的那串代码。          

3. 然后继续输入并运行以下命令     

	  ``` bash    

	  bcdedit /set {你记下的那串代码} hypervisorlaunchtype OFF   

	 ```  

在启动的时候选择"Windows 10 (关闭 Hyper-V)"  这个启动选项就可以使用Vmare了

   