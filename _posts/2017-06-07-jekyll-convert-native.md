---
layout: post
title: jekyll 如何转义字符
date: 2017-06-07   
header-img: "img/home-bg.jpg"
tags:
     - jekyll
author: '老付'
---


在使用jekyll去写博客的时候,有时候会输入双括号 或者是段html，但在jekyll默认会把对应的值赋到对应的字段占位上面,所以我们去想，如何去把这个输入做一个转义：


#### 网络上提供的几种解决方案  

  1. 使用 "\\" 转义      

      ``` ruby 
      {% raw %}
      <h1>\{\{ page.title \}\}</h1>
      {% endraw %}

      ```       


     显示结果   \<h1\>\{\{ page.title \}\}</h1>    

  2. 在两个大括号之间添加一个空格      

      ``` ruby 
      {% raw %} 
       { { page.title } }  
      {% endraw %}

      ```      
      显示结果： { { page.title } } 

  3. 使用raw语法，具体使用如下： 
      
      ``` ruby 
	  {% assign openTag = '{%' %} 
	  {{ openTag }} raw %}    

	     content # 代码块   

	  {{ openTag }} endraw %}

      ```   
  4. 如何显示{% assign openTag = '{%' %}{{ openTag }} raw %}{{ openTag }} endraw %}呢？具体如下： 



      ``` ruby  

      {% raw %}
		{% assign openTag = '{%' %} 
		{{ openTag }} raw %}    

		   content # 代码块   

		{{ openTag }} endraw %}
	  {% endraw %}

      ```        


     把{% raw %}｛% {% endraw %}作为一个openTag的变量,直接拼装成{% assign openTag = '{%' %}{{ openTag }} raw %}
 