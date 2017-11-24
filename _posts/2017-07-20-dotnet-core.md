---
layout: post
title: .netcore的快速入门
date: 2017-07-20
header-img: "img/home-bg.jpg"
keywords: 如何安装.netcore,使用.netcore快速开发,.netcore与linux
tags:
     - .Net
author: '老付'
---
 

###  .netcore，mono与.net framework 之间的关系    

这个问题可以追溯到.net还没有开源和跨平台的时候，只有for windows版本的.net framework，为了.net能够跨平台，Xamarin 就开发mono就出现了(可以 理解成新的.net平台），解决了.net跨平台的问题，同时mono也是开源的。 而当.netcore推出之后，在.net平台下又多了一个开源的跨平台的实现，与mono，.netframework一样都是一种.net形势的存在。而未来据说，.net framework与mono都会基于.netcore去开发和扩展。下面用一个图来描述他们之间的关系：     

 ![netcore](/img/assets/netcoreanddonet.png)   


.net framework 与.netcore的关系如下图：

 
 ![donet](/img/assets/donet.png)       



### 安装使用.netcore      

  .netcore本身就是一个跨平台的.net平台实现，下面我将在不同的操作系统下面实现.netcore的helloword.


#### windows下使用 .netcore     

 在windows下面使用.netcore是比较简单的

 1. 下载安装[donetcore](https://download.microsoft.com/download/B/9/F/B9F1AF57-C14A-4670-9973-CDF47209B5BF/dotnet-dev-win-x64.1.0.4.exe) 
 
 
 2. 打开cmd，运行命令 **dotnet --version** 可以获得.netcore的版本号        
 
 
    ![dotnetVersion](/img/assets/dotnetVersion.png)    
 
 
 3. 在cmd中找到工作的目录，运行以下命令：    


    ``` bash   
    
    dotnet new console -o hw

    cd hw 

    dotnet restore  

    dotnet run

    ```      

    运行结果如下：    

    ![dotnetcore](/img/assets/netcorehw.png)   


 
#### linux下安装使用      


 在linux的使用，由于本人用的ubuntu的系统，所以是在ubuntu下面演示：

1. 安装dotnetcore,运行以下命令：  

	  ``` bash  
	  sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'

	  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893   

	  sudo apt-get update   

	  sudo apt-get install dotnet-dev-1.0.4


	  ```         

2. 安装成功后，就与在window下面的内方式相同    

	 ``` bash 
	 dotnet new console -o hwapp

	 cd hwapp   

	 dotnet restore

	 dotnet run

	 ```    

#### linux（Ubuntu）安装出现的问题 (一)         

  ```  bash    
  You might want to run 'apt-get -f install' to correct these:
The following packages have unmet dependencies:
 dotnet-dev-1.0.4 : Depends: dotnet-sharedframework-microsoft.netcore.app-1.1.2 but it is not going to be installed
                    Depends: dotnet-sharedframework-microsoft.netcore.app-1.0.5 but it is not going to be installed
 google-chrome-stable : Depends: libappindicator1 but it is not going to be installed
E: Unmet dependencies. Try 'apt-get -f install' with no packages (or specify a solution).

  ```       
![apt-get instal -f](/img/assets/adp-get-f.png)
  **解决方案：**        

  ``` bash    

  sudp apt-get install -f          

  ```     



---------------------------------------------------------    

#### linux（Ubuntu）安装出现的问题 (二) 

  ```  bash    
	  Some packages could not be installed. This may mean that you have
	requested an impossible situation or if you are using the unstable
	distribution that some required packages have not yet been created
	or been moved out of Incoming.
	The following information may help to resolve the situation:

	The following packages have unmet dependencies:
	 dotnet-dev-1.0.4 : Depends: dotnet-sharedframework-microsoft.netcore.app-1.1.2 but it is not going to be installed
	                    Depends: dotnet-sharedframework-microsoft.netcore.app-1.0.5 but it is not going to be installed
	E: Unable to correct problems, you have held broken packages.

  ```      
  ![install](/img/assets/install.png)     


  **解决方案：**   添加一个新的软件源    

  ``` bash     

   deb http://security.ubuntu.com/ubuntu trusty-security main   

  ```   

  



 