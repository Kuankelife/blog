---
layout: post
title: 说说.Net与Java中的字符串
date: 2017-08-18
tags:
     -  Java  
keywords: ".Net与Java字符串区别|不使用new来创建字符串对象|字符串其它的引用类型有什么不同"
description: "说说Java与.Net中字符串的的不同,以及和其它引用类型不同的地方"
author: '老付'
---    

### Java字符串碰到的问题   


   在写Java程序碰到一个问题，而正是这个问题引发了我对字符串的思考，Java示例代码如下：    


   ```  Java       

	   public void TestStr(String success) 
	   {

	       if(success=="Y"){
	           System.out.println("Equal");
	       }
	       else
	       {
	           System.out.println("Not Equal");
	       }

	   }

   ```       

   上面的这个函数很简单，但会随着调用的方式的不同而显示出不同的结果：   

   ```  Java      
   public void CallMethod()
   {
        TestStr("Y");//Equal
        TestStr("YY".substring(0,1));//Not Equal
    }

   ```          

  对于这样的一个结果，我们可以先思考一个问题：" == " 这个运算符的作用？    

   1. 对于基础数据类型而言是比较值是否相同(作用与equal相同)     

   2. 对于引用类型，则比较地址是否一样           


但如果理解上面的代码，我们还要理解Java中字符串的机制。由于字符串是比较常用的类型，为了保证性能，所以在设计字符串的时候会有一个“池”的概念。    

   -  字符一旦创建成功后，就不再发生变化，字符的运算也都是创建新的字符串对象       

   -  字符创建前，查找内存中是否已经存在相同的字符串，如果有则直接把地址给当前的对象，没有则直接创建新对象    


   所以对于上面的代码，因为在开始已经创建的“Y”字符串，所以后面出生现的所有的“Y”都是引用我们当前的“Y”，所以我们就可以理解为什么第一个是打印Equal，另一个是打印Not Equal.


### .Net中如何处理        

  而对于.Net来说，字符串的原理大致相同，如果是相同的代码，但运算的结果是与Java不一样的：      

  ![dotnet](http://ov0ibj1bt.bkt.clouddn.com/STR_dotnet.png)          


  我们知道在.Net string也是引用类型，但当“==”作用于两个引用类型的时候，比较则是地址，但在.Net中字符比较时，比较的却是值。这个归功于.Net对“==”的重载，[string源码](http://referencesource.microsoft.com/#mscorlib/system/string.cs,8281103e6f23cb5c){:target="_blank"}。如果想比较地址，则使用  object.ReferenceEquals()这个函数。        


  ``` C#       

    public static bool operator == (String a, String b)
    {
        return String.Equals(a, b);
    }
  
  ```        

  对于.Net运算符重载的这个动作，个人觉得更贴近日常的使用习惯，因为在编码的过程中，字符串中绝大多数的使用场景都是值，而不是引用。而对Java而言，保证的运算的原汁原味，少了人为的封装的干扰，使用是注意区分，习惯了反而觉得更为合理。

### 几个疑问 

 
####  字符串是引用类型，为什么不使用new来创建对象？    
 
  字符串是一个特殊的引用对象 ，声明就是创建了一个对象，如果使用new,则会重复的创建对象(Java中可以使用new创建，.Net中则直接不允许这样操作)，浪费内存，如下：   

  ``` Java　　　　

  String str=new String("1234");

  String str1="1234";

  ```

 两种的定义方式相同，但是使用new的时候，又额外分配了内存空间。




####  字符串是引用类型，但是传参的时候却无法修改它的值？有其它的引用类型有什么不同？   


```   Java   
  public void CallMethod(){

    String str="abc";
    AddSuffix(str);

    System.out.println(str);//打印出abc
  }
   
  public void AddSuffix(String x){

      x=x+"123";
  }



```     

当我们去调用这个函数的时候，发现str的值却没有发生改变。 因为在调用AddSuffix 函数时，str把自己作拷贝成一个副本传递给形参x，当对x赋值的时候，系统重新创建了一个字符对象，把引用的地址给x,此处是重新创建对象，而不是修改原来的字符串对象（字符串不可更改）。两种方式示意如下：   


  ![字符串](http://ov0ibj1bt.bkt.clouddn.com/STR_Function.png)         


  ![字符串](http://ov0ibj1bt.bkt.clouddn.com/STR_common.png)   











 






