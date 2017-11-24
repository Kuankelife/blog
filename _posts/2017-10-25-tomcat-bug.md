---
layout: post
title: Tomcat不安全字符的处理
date: 2017-10-25
keywords: "Tomcat不安全字符的处理|get null null 400|Url中有竖线花括号"
description: "在URL中有|{}等不安全字符的时候,tomcat这个是就会不响应这个请求,并在Access_log中打入get null null 400"
tags:
     - 原理
author: '老付'
---

做项目的时候碰到一个问题，就是Tomcat在处理含有\|，\{，\}的字符的Url时候，发现请求没有到达指定的Controller上面，而在Access_log中写入了get null null 400的错误信息，从网上也翻了几个资料最终确定是tomcat的一个问题（个人觉得也是一个缺陷）   

#### 问题的由来       


Tomcat根据[rfc的规范](https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E6%A0%87%E5%BF%97%E7%AC%A6)Url中不能有类似\|，\{，\}等不安全字符串，但在实际的操作中有时为了数据完整性和加密的方式都需要有\|，\{，\}出现，这样的话Tomcat会直接告诉客户端**Bad Request**.        




对于这个问题，很多人也提出很多不同的看法：[https://bz.apache.org/bugzilla/show_bug.cgi?id=60594](https://bz.apache.org/bugzilla/show_bug.cgi?id=60594)，经过修改，最终Tomcat把权限开放出来，通过**tomcat.util.http.parser.HttpParser. requestTargetAllow**这个配置选项，允许不安全字符的出现。[Tomcat详细配置](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#Other)


#### 解决方法       

 经过几次探索，有以下几个方法能够解决这个问题：   

1. 把请求的Url进行编码，这个对源头进行处理，来规避这个问题，如果是第三方来调用的url就无能无力。    

2. 修改Tomcat的配置文件（Tomcat\conf\catalina.properties）,适用tomcat 7以上的版本  

	 ``` cte      

	  tomcat.util.http.parser.HttpParser.requestTargetAllow=|{}

	 ```      

3. 使用其它服务器进行中转，比如IIS和Apache