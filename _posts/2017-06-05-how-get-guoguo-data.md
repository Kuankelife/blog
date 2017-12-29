---
layout: post
title: 爬取菜鸟裹裹的数据
date: 2017-06-05
header-img: "img/home-bg.jpg"
keywords: "爬取菜鸟裹裹数据|菜鸟裹裹数据|菜鸟裹裹数据接口|菜鸟裹裹API|菜鸟裹裹"
tags:
     - 爬虫
author: '老付'    
---


[菜鸟裹裹](http://www.guoguo-app.com){:target="_blank"}是阿里旗下的一个物流数据的整合平台,数据准确、及时.前几天在关注菜鸟和顺丰的争端,因为在前一天我刚刚爬到菜鸟上面的快递数据，第二天看到二者出现了摩擦，在菜鸟上面已经查不到顺丰的信息了,还好有国家邮政局出面了解决,不得不为我们是社会主义点个赞。这次爬数据经历点波折,个人觉得阿里做的安全性还是很专业的。下面开始介绍如何找到突破口把数据拿到的。			

------------------- 		
  
				 声明:此文只做技术交流,请不要恶意攻击,当然我也相信阿里的技术，不可能轻意被攻破的。     

-------------------			

### 监控Ajax请求     

 - 打开Chrome的控制台中的NetWork后,点击上面的查询按钮,查看请求记录，如下使用一个顺丰的物流号查询出对应的信息和请求：

  ![shufeng](/img/assets/shufeng.png)     	

  对应的请求为： 

    
  ![NetWorkInfo](/img/assets/NetWorkRequest.png)       

  ![NetWorkInfo](/img/assets/NetWorkInfo.png)      

  > 参数原始为：v=1.0&api=mtop.cnwireless.CNLogisticDetailService.wapqueryLogisticPackageByMailNo&appKey=12574478&t=1496714756142&callback=mtopjsonp5&type=jsonp&sign=2ac43c025e94399c2ee2b7e0240f8303&data=xxxx     

### 分析Url参数    
 
 从上面的请求和响应结果可以看出,请求的参数为:**v, api, appKey, t, callback, type, sign, data**，其中很明显sign是加密的,appKey在多次请求验证后发现是一个固定的值,callback是回调的参数,这个我们用不到，直接给一个任意值就可以，根据callback参数和type=jsonp,可以推测出,菜鸟使用的跨域回调的方法来进行数据传输的,这里也在js代码里面已经有验证了,采用的是动态追加<script>标签的方法(可以自己去验证)。          

 右击查看在新的标签布页打开链接,查看数据详细：   

  ![jsonp](/img/assets/GuoGuojson.png)    

 > utl链接：http://api.wap.guoguo-app.com/h5/mtop.cnwireless.cnlogisticdetailservice.wapquerylogisticpackagebymailno/1.0/?v=1.0&api=mtop.cnwireless.CNLogisticDetailService.wapqueryLogisticPackageByMailNo&appKey=12574478&t=1496640120201&callback=mtopjsonp14&type=jsonp&sign=1d53d2faaf0e067f21b4b43b95d5ee9c&data=xxxx     

 现在的问题就是解决下面的的几个参数t和sing,这两个都可以调试对应的js来进行查看,页面js的路径为：//g.alicdn.com/cn/guoguo-website/1.1.0/js/query.js      

 找到dom绑定的代码：    

  ![domBind](/img/assets/guoguoBtn.png)      

 如果你看到的代码是压缩的,可以使用chrome的格式化工具格式化：   

  ![chromeFormater](/img/assets/chromFormater.png)        

  下面的工作就要考验你的耐心了。。。    


### 调试和分析js      

   从上面的图片可以看到下面的代码：   

   ``` js 
    $("#J_SearchBtn").on("click", function() {
                if (!$(".search-container").hasClass("loading")) {
                    var o = $.trim($("#J_SearchInput").val());
                    if ("" === o)
                        return;
                    e._handleSearch(o)
                }
            })

   ```    
   可以看出首先调用的是e._handleSearch的函数，而o是当前输入的编号，继续跟进  	

   ![loading](/img/assets/loading.png)        

   在调用完loading方法后，调用了_requestPackage方法，详细看下这个方法：   

   ``` js      

      _requestPackage: function(e) {
            function o(o) {
                c.unloading();
                var i = o.data;
                if (i) {
                    var r = i.cpCompanyInfo || {}
                      , n = i.transitList || [];
                    n = n.reverse(),
                    t(r),
                    a(n),
                    c._setHistory(r.companyCode, e),
                    c._initSearchHistory()
                }
            }
            function t(e) {
                $(".cp-logo img").attr("src", e.iconUrl102x38),
                $(".cp-name").html(e.companyName);
                var o = $(".cp-link");
                o.attr("href", "http://" + e.webUrl),
                o.html(e.webUrl),
                $(".cp-phone label").html(e.serviceTel),
                $(".cp-container").show()
            }
            function a(e) {
                var o = "";
                $.each(e, function(e, t) {
                    o += 0 == e ? '<li class="latest">' : "<li>",
                    o += '   <span class="date">' + t.time + '</span>   <span class="text">' + t.message + "</span></li>"
                }),
                $("#J_SearchTimeout").hide(),
                0 == e.length ? ($("#J_SearchNoRecord").show(),
                $(".package-container").hide()) : ($("#J_PackageDetail").html(o),
                $(".package-container").show(),
                $("#J_SearchNoRecord").hide())
            }
            function r() {
                c.unloading(),
                $(".cp-container").hide(),
                $(".package-container").hide(),
                $("#J_SearchNoRecord").show()
            }
            var c = this;
            lib.mtop.request({
                api: i.queryLogisticPackageByMailNo,
                v: "1.0",
                data: {
                    mailNo: e
                },
                timeout: 5e3,
                type: "GET",
                dataType: "jsonp",
                isSec: 0,
                ecode: 0
            }, o, r)
        },    

   ```        

   **_requestPackage**内部有很多函数的定义，函数运行的核心在于 lib.mtop.request()方法，这个函数有三个参数，分别是json对象，单号o,和一个回调函数r。后面的调试过程省略。。。。(自己找吧)

  在最终的mtop.js中有一个  **l**  的函数，可以找到我们想要的信息如下：   

  ![mtopjs](/img/assets/mtopjs.png)         

  从图片上面可以看出参数**t**只是一个时间戳,同样在这个函数里面看到了sign的赋值:     

  ![sign](/img/assets/sign.png)      


  上面是一个调用了一个 **k** 函数，k函数的定义如下：

   ``` js     
     function k(a, b, c) {
        i(function(e) {
            var f = d(e + "&" + b + "&" + h() + "&" + a);
            c(f)
        })//在这里又调用了i的函数
     }    

   ```     

   k中又调用了i函数：

   ```  js      
      function i(b) {
        function c(a) {
            a = a ? a.split("_")[0] : "",
            b(a)
        }
        N.useAlipayJSBridge === !0 && !S && T && a.AlipayJSBridge && a.AlipayJSBridge.call ? a.AlipayJSBridge.call("getMtopToken", function(a) {
            a && a.token ? c(a.token) : c(f(P))
        }, function() {
            c(f(P))
        }) : c(f(P))
    }

   ```      
   ```  js   

    function f(a) {
        var b = new RegExp("(?:^|;\\s*)" + a + "\\=([^;]+)(?:;\\s*|$)").exec(A.cookie);
        return b ? b[1] : c
    }

   ```     

   在i的内部是由f(P)返回的值传递给b,而b函数是上面调用i的传入的匿名函数，在匿名函数调用传入a调用k参数中的匿名回调函数function(a){...},所以可以确定f是我们想要的sign值。f值的来自于d函数的返回值


   ``` js     

     var f = d(e + "&" + b + "&" + h() + "&" + a);
            c(f)  


   ```        


   d中的几个参数a:是k传过来的a.data,是经过包装的单号{mailNo:xxx},b是t参数,就是时间戳。h()是上面说的appKey,可以调试看出来是一个固定值 12574478。 而对于e,是函数i中的f(P),经函数c中的三元表达式**a = a ? a.split("_")[0] : ""**处理后的结果,而P值我们可以找到定义的地方，发现它是一个固定值：    

   ![PValue](/img/assets/PCookie.png)       


   总结上面的分析，目前所有的参数都已经大体清楚，剩下的就是获得e最终的值和函数d的作用。


### cookie的分析        

   对于e值的获得是来自于cookie,再看函数f的逻辑,其中参数a是一个固定值P:   

    
   ```  js   

    function f(a) {
        var b = new RegExp("(?:^|;\\s*)" + a + "\\=([^;]+)(?:;\\s*|$)").exec(A.cookie);
        return b ? b[1] : c
    }

   ```      

   这个是一个正则匹配出对应的cookie中的value,这里可以不用细看，可以直接用代码来模拟。

### 加密     

   刚开始看了函数d的返回值，觉得是一个加密函数，后面看脚本内容证实了猜想，但问题是这个是什么方式的加密呢？可以先看下函数d的核心代码：   

   ``` js   
    var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
        for (a = n(a),
        x = l(a),
        t = 1732584193,
        u = 4023233417,
        v = 2562383102,
        w = 271733878,
        o = 0; o < x.length; o += 16)
            p = t,
            q = u,
            r = v,
            s = w,
            t = h(t, u, v, w, x[o + 0], y, 3614090360),
            w = h(w, t, u, v, x[o + 1], z, 3905402710),
            v = h(v, w, t, u, x[o + 2], A, 606105819),
            u = h(u, v, w, t, x[o + 3], B, 3250441966),
            t = h(t, u, v, w, x[o + 4], y, 4118548399),
            w = h(w, t, u, v, x[o + 5], z, 1200080426),
            v = h(v, w, t, u, x[o + 6], A, 2821735955),
            u = h(u, v, w, t, x[o + 7], B, 4249261313),
            t = h(t, u, v, w, x[o + 8], y, 1770035416),
            w = h(w, t, u, v, x[o + 9], z, 2336552879),
            v = h(v, w, t, u, x[o + 10], A, 4294925233),
            u = h(u, v, w, t, x[o + 11], B, 2304563134),
            t = h(t, u, v, w, x[o + 12], y, 1804603682),
            w = h(w, t, u, v, x[o + 13], z, 4254626195),
            v = h(v, w, t, u, x[o + 14], A, 2792965006),
            u = h(u, v, w, t, x[o + 15], B, 1236535329),
            t = i(t, u, v, w, x[o + 1], C, 4129170786),
            w = i(w, t, u, v, x[o + 6], D, 3225465664),
            v = i(v, w, t, u, x[o + 11], E, 643717713),
            u = i(u, v, w, t, x[o + 0], F, 3921069994),
            t = i(t, u, v, w, x[o + 5], C, 3593408605),
            w = i(w, t, u, v, x[o + 10], D, 38016083),
            v = i(v, w, t, u, x[o + 15], E, 3634488961),
            u = i(u, v, w, t, x[o + 4], F, 3889429448),
            t = i(t, u, v, w, x[o + 9], C, 568446438),
            w = i(w, t, u, v, x[o + 14], D, 3275163606),
            v = i(v, w, t, u, x[o + 3], E, 4107603335),
            u = i(u, v, w, t, x[o + 8], F, 1163531501),
            t = i(t, u, v, w, x[o + 13], C, 2850285829),
            w = i(w, t, u, v, x[o + 2], D, 4243563512),
            v = i(v, w, t, u, x[o + 7], E, 1735328473),
            u = i(u, v, w, t, x[o + 12], F, 2368359562),
            t = j(t, u, v, w, x[o + 5], G, 4294588738),
            w = j(w, t, u, v, x[o + 8], H, 2272392833),
            v = j(v, w, t, u, x[o + 11], I, 1839030562),
            u = j(u, v, w, t, x[o + 14], J, 4259657740),
            t = j(t, u, v, w, x[o + 1], G, 2763975236),
            w = j(w, t, u, v, x[o + 4], H, 1272893353),
            v = j(v, w, t, u, x[o + 7], I, 4139469664),
            u = j(u, v, w, t, x[o + 10], J, 3200236656),
            t = j(t, u, v, w, x[o + 13], G, 681279174),
            w = j(w, t, u, v, x[o + 0], H, 3936430074),
            v = j(v, w, t, u, x[o + 3], I, 3572445317),
            u = j(u, v, w, t, x[o + 6], J, 76029189),
            t = j(t, u, v, w, x[o + 9], G, 3654602809),
            w = j(w, t, u, v, x[o + 12], H, 3873151461),
            v = j(v, w, t, u, x[o + 15], I, 530742520),
            u = j(u, v, w, t, x[o + 2], J, 3299628645),
            t = k(t, u, v, w, x[o + 0], K, 4096336452),
            w = k(w, t, u, v, x[o + 7], L, 1126891415),
            v = k(v, w, t, u, x[o + 14], M, 2878612391),
            u = k(u, v, w, t, x[o + 5], N, 4237533241),
            t = k(t, u, v, w, x[o + 12], K, 1700485571),
            w = k(w, t, u, v, x[o + 3], L, 2399980690),
            v = k(v, w, t, u, x[o + 10], M, 4293915773),
            u = k(u, v, w, t, x[o + 1], N, 2240044497),
            t = k(t, u, v, w, x[o + 8], K, 1873313359),
            w = k(w, t, u, v, x[o + 15], L, 4264355552),
            v = k(v, w, t, u, x[o + 6], M, 2734768916),
            u = k(u, v, w, t, x[o + 13], N, 1309151649),
            t = k(t, u, v, w, x[o + 4], K, 4149444226),
            w = k(w, t, u, v, x[o + 11], L, 3174756917),
            v = k(v, w, t, u, x[o + 2], M, 718787259),
            u = k(u, v, w, t, x[o + 9], N, 3951481745),
            t = c(t, p),
            u = c(u, q),
            v = c(v, r),
            w = c(w, s);
        var O = m(t) + m(u) + m(v) + m(w);
        return O.toLowerCase()

   ```      

   通过代码我个人是很难看出用的是什么加密方式，所以我在控制台，测试了加密的结果     

   ![md5](/img/assets/md5.png)       


   通过这个结果可以先排除des加密了（因为des都是以==结尾），经过几种加密方式对比发现是md5的32bit的加密。

   ![md5](/img/assets/md5Online.png)        


   好了，到这里,已经是万事具备.下面开始去写代码抓取,代码很简单，不多解释：   

   ``` C#     
	var mainUrl =
	        @"http://api.wap.guoguo-app.com/h5/mtop.cnwireless.cnlogisticdetailservice.wapquerylogisticpackagebymailno/1.0/";
	var cookieUrl =
	        @"http://api.wap.guoguo-app.com/h5/mtop.cnwireless.cncainiaoappservice.getlogisticscompanylist/1.0/?v=1.0&api=mtop.cnwireless.CNCainiaoAppService.getLogisticsCompanyList&appKey=12574478&t=1496741493353&callback=mtopjsonp1&type=jsonp&sign=b0f7376271effd90e311f998ad3a3efb&data=%7B%22version%22%3A0%2C%22cptype%22%3A%22all%22%7D";

    var mailNo = "xxxxxx";//运单号码
    //准备参数
    var tikets = (DateTime.Now - Convert.ToDateTime("1970-01-01 00:00:00")).Ticks.ToString();
    var cookie = Tools.Tools.GetCookie(cookieUrl);//先请求一次获得cookie,可以先缓存下来。
    var key = new Regex(@"(?:^|;\s*)_m_h5_tk\=([^;]+)(?:;\s*|$)").Match(cookie).Value.Split('=')[1]
        .Split('_')[0];
    var sign = GetMD5Hash(key + "&" + tikets + "&12574478" + "&{\"mailNo\":\"" + mailNo+ "\"}")
        .ToLower();

    //获得参数列表
    var urlParas = string.Format(
        "?v=1.0&api=mtop.cnwireless.CNLogisticDetailService.wapqueryLogisticPackageByMailNo&appKey=12574478&t={0}&callback=mtopjsonp&type=jsonp&sign={1}",
        tikets, sign);
    urlParas += "&data={\"mailNo\":\"" + mailNo + "\"}";

    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(mainUrl+urlParas);
    request.Method = "GET";
    request.Headers.Add("Cookie", cookie);
    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
    StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
    string content = reader.ReadToEnd();
    Console.WriteLine(content);
    Console.ReadKey();   

   ```       
#### 方法中会用到的方法
   ```  C#     

    //md5加密
    public static string GetMD5Hash(String input)
    {

        return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(input, "md5");

    }
    //获得cookie
    public static string GetCookie(string url, int Timeout = 5000, bool isNeedProxy = true)
    {
        try
        {

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
                     request.AllowAutoRedirect = false;
            request.ContentType = "application/x-www-form-urlencoded;charset=gbk";
            request.CookieContainer = new CookieContainer();
            request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11";
            
            
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.Default);
            string content = reader.ReadToEnd();
            return response.Headers.Get("Set-Cookie");
        }
        catch (Exception ex)
        {

            return null;
        }
    }
   ```   




   返回数据：

   ![deliverResult](/img/assets/deliverResult.png)




   [菜鸟裹裹Demo](https://u7704756.pipipan.com/fs/7704756-232761900)（可能已经不能用）
   [快递100数据Demo](https://u7704756.pipipan.com/fs/7704756-232761947)






















