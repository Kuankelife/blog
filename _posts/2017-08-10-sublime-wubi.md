---
layout: post
title: linux下sublime如何使用中文
date: 2017-08-10
tags:
     -  Linux   
keywords: "linux下sublime如何使用中文|sublime在linux下无法打字|解决Ubuntu下Sublime Text 3无法输入中文"
description: "解决linux下sublime如何使用中文"
author: '老付'
---


   原来在使用linux的时候最大的诟病是在sublime text下面不能写中文，各种百度和搜索都没能解决，但现在又重新下linux下面做开发，又要重新面对这个问题，好在问题已经有了很好的解决方案。        


### 使用方法          


- 首先更新你的系统 :   

  ``` bash      

  sudo apt-get update && sudo apt-get upgrade     

  ```              


- 选择一个目录后，用git clone 下面地址：     

  ```   bash         

  git clone https://github.com/lyfeyaj/sublime-text-imfix.git

  ```         


- 使用命令进入sublime- text- imfix 路径 ：       

  ``` bash    

  cd sublime-text-imfix

  ```          



- 运行以下脚本     


  ``` bash         

  ./sublime-imfix     

  ```     

- 完成后 重启电脑。     
 
 ![解决Ubuntu下Sublime Text 3无法输入中文](/img/assets/fixsublime.png)






