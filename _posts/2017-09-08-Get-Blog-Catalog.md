---
layout: post
title: 博客添加浮动目录
date: 2017-09-08
keywords: "博客目录插件|博客如何添加浮动目录|博客添加浮动目录"
description: "写了一个生成博客目录的插件，在打开博客的时候，会自动生成对应的博客目录在右正角"
tags:
     - js   
     - 插件
author: '老付'
---    



 一直都想给自己的博客添加一个浮动的目录，在网上也找也几个，从易用性方面都不是太理想，所以今天才有了想法自己去写一个插件 。      


### 需求      


 ```  content   
 
 1. 当打开博客的时候在右下角自动生成对应的目录  

 2. 支持拖拽移动  

 3. 可以点击展开和收缩  （目前未实现）

 ```           

 易用性方面，希望能够直接引用 js后，来执行一句代码来完成对应的动作  。    


###  实现逻辑      

 ---------------       

 1. 读取页面的所有h1,h2,h3,h4,h5    

 2. 根据对应的元素和排序，生成对应的数据，格式如下：   

	 ```  json       
	  [
	    {
	        text: "目录",
	        level: 2,
	        achorName: "目录",
	        order: 1,
	        chapterIndex: "1"
	    }, {
	        text: "UTF8的出现",
	        level: 3,
	        achorName: "utf8的出现",
	        order: 6,
	        chapterIndex: "1.5"
	    }
	]

	 ```    

 3. 根据数据生成对应的html         

 ![CataLog](http://ov0ibj1bt.bkt.clouddn.com/CataJsn.png)



### 相关使用      
  
 代码地址：[ICatalogJs](https://github.com/fuwei199006/ICatalogJs)       

 使用时候只需要引用js后，执行init方法：   

 ```   js       
	<script type="text/javascript">
		catalog.init();
	</script>

 ```     

 本篇对应的效果可以看右下角





