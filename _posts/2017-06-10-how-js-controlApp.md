---
layout: post
title: js如何操作本地程序
date: 2017-06-10
header-img: "img/home-bg.jpg"
tags:
     - js
author: '老付'
---

### 背景     

  假设有这样一个产品，一个web和一个winform客户端，在客户在web的网页上面点击启动客户端来处理,这个时候开始调用本地的客户端,来完成指定的工作。这种场景在日常的上网中也比较常见,如使用迅雷下载。当然实现的方式也有很多种，今天我来演示一种用监控Http请求来实现这个功能，思路如下：        
  
  ![jsApp](/img/assets/js_app.png)        


### HttpListener    

   对于上面的分析，最重要的功能虽实现对Http的监控，而.net中已经封装了我们的需求,下面看下如何具体的实现：   


   ``` C#       
   static void Main(string[] args)
    {
        HttpListener listerner = new HttpListener();

        try
        {
            listerner.AuthenticationSchemes = AuthenticationSchemes.Anonymous;//指定身份验证 Anonymous匿名访问
            listerner.Prefixes.Add("http://localhost:8080/Service/");
            listerner.Start();
        }
        catch (Exception ex)
        {
            Console.WriteLine("无法启动监视:" + ex.Message);
        }

        Task.Factory.StartNew(() =>  //使用一个线程对监听
        {
            while (true)
            {
                HttpListenerContext ctx = listerner.GetContext();
                Task.Factory.StartNew(TaskProc, ctx);//回调函数,开启新线程进行调用，不影响下次监听
            }
        });

        Console.ReadKey();
    }


   ```         
  
###  实现请求的响应   

   现在我们可以拿到请求的上下文的信息ctx,先定义一个参数的格式，简单的定义如下：   
    
   ```  C#     
    public class ReciveInfo
    {
        public string path { get; set; }//应用程序所在的路径

        public string name { get; set; }//应用程序名称
    }


   ```  
 

   下面对ctx的Response数据进行填写.  

   ```  C#　　　 

    static void TaskProc(object o)
    {
        HttpListenerContext ctx = (HttpListenerContext)o;
        StreamWriter writer = new StreamWriter(ctx.Response.OutputStream, Encoding.UTF8);
        try
        {
            //接收POST参数
            Stream stream = ctx.Request.InputStream;
            StreamReader reader = new StreamReader(stream, Encoding.UTF8);
            String body = HttpUtility.UrlDecode(reader.ReadToEnd());
            Console.WriteLine(body);
            var reciveInfo = Json.JsonParser.Deserialize<ReciveInfo>(body);
            Process.Start(reciveInfo.path);
             ctx.Response.Headers.Add("Access-Control-Allow-Origin","*"); //防止出现跨域的问题错误
            ctx.Response.StatusCode = 200; //设置返回给客服端http状态代码
            writer.Write(reciveInfo.name + "启动成功");
        }

        catch (ArgumentException e)
        {
            ctx.Response.StatusCode = 500;
            writer.Write("参数有误:" + e.Message);
        }
        catch (Exception e)
        {
            ctx.Response.StatusCode = 500;
            writer.Write("程序异常:" + e.Message);
        }
        finally
        {
            writer.Close();
            ctx.Response.Close();
        }

    }

   ```     


### 测试      

  在测试中我在js中启动我电脑中的QQ,具体的代码如下：    

  ``` html   


	<button id="btnQQ"> start QQ</button>
	<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript">
	$(function() {
	    $("#btnQQ").click(function() {

	        $.ajax({
	            type: "POST",
	            url: "http://localhost:8080/Service",
	            dataType: "json",
	            data: JSON.stringify({
	                path: "D:/Program Files/Tencent/QQ/Bin/QQScLauncher.exe",
	                name: "qq"
	            }) 
	        });
	    });
	});
	</script>


  ```       

  启动后，运行截图如下：   

  ![StarQQ](/img/assets/qqstart.png)    


 



