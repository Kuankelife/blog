---
layout: post
title: Java反射和注解 
date: 2017-09-17
keywords: "Java反射|Java注解|java反射机制详解|java反射执行方法|java反射使用"
description: "Java如何实现反射和注解，以及相关的使用"
tags:
     - Java
author: '老付'
---        


### 反射      


反射是指在运行的状态，对于任意一个类，都能够知道类里面的所有的属性和方法，并能够进行属性的赋值和方法的调用 。 在java中使用java.lang下面的Class来表示**类型的"类" ** ，在[JDK](http://tool.oschina.net/apidocs/apidoc?api=jdk-zh)中定义接口如下 


![Java反射](/img/assets/Reflect/Reflect_Class.png)       

其中T 表示运行时类的类型，如果不知道类型可以使用Class<?>，Class表示的实例表示正在运行的 Java 应用程序中的类（包含枚举） 和接口 ， 所有的反射出来的结果都共享一个基类Class。    

#### 获得类型、方法、属性和构造器      


在java中有三种方法可以反射定制类的Class(以String类型为例):       

``` cte   
1. 通过Class.from("java.lang.String")    

2. 通过String.class    

3. 通过类的实例对像中的getClass()方法 ："abc".getClass()

```


为了演示反射的功能，我们首先定义一个类型：   

```java
class Person
{
    private String userName;
    private String userCode;
    public  String Sex;//字段
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getUserCode() {
        return userCode;
    }
    
    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }
    
    public String GetUserNameWithUserCode(){
        return this.getUserName()+"_"+getUserCode();
    }
    
    public String GetUserNameWithUserCode(String prefix){
        return prefix+"_"+ this.getUserName()+"_"+getUserCode();
    }
    
    public static String GetClassName(String prefix){
        return prefix+"_Person";
    }
}

```

获得**Person**类中的方法、属性和构造器，代码如下： 

``` java
try {
    Class<?> clazz = Class.forName("Person");
    
    System.out.println("--------------Person的方法如下----------------");
    Method[] methods = clazz.getMethods();
    for (Method m : methods) {
        System.out.println(m);
    }
    
    
    System.out.println("--------------Person字段如下----------------");
    Field[] fields = clazz.getFields();
    for (Field f : fields) {
        System.out.println(f);
    }
    
    System.out.println("--------------Person构造函数如下----------------");
    Constructor<?>[] constructors = clazz.getDeclaredConstructors();
    for (Constructor c : constructors) {
        System.out.println(c);
    }
} catch (Exception e) {
    e.printStackTrace();
}
```          

运行结果：      

```cte
--------------Person的方法如下----------------
public java.lang.String Person.getUserName()
public java.lang.String Person.GetUserNameWithUserCode()
public java.lang.String Person.GetUserNameWithUserCode(java.lang.String)
public void Person.setUserName(java.lang.String)
public java.lang.String Person.getUserCode()
public void Person.setUserCode(java.lang.String)
public static java.lang.String Person.GetClassName(java.lang.String)
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public boolean java.lang.Object.equals(java.lang.Object)
public java.lang.String java.lang.Object.toString()
public native int java.lang.Object.hashCode()
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()
--------------Person字段如下----------------
public java.lang.String Person.Sex
--------------Person构造函数如下----------------
Person()

```    
 
#### 方法的调用和属性的赋值        

上面的代码我们能够获得对应的属性和方法，下面就解决如何去调用当前方法和属性进行赋值:   

```java
try {
        Class clazz =Class.forName("Person");
        Object obj=clazz.newInstance();//创建对象
        
        //set方法的获得
        Method setUserName=clazz.getMethod("setUserName",String.class);
        Method setUserCode=clazz.getMethod("setUserCode",String.class);
        //set方法的调用
        setUserName.invoke(obj,"fuwei");
        setUserCode.invoke(obj,"F0001");
        
        //一般方法的获得和调用
        Method m1=clazz.getMethod("GetUserNameWithUserCode");
        String s1= m1.invoke(obj,null).toString();
        
        Method m2=clazz.getMethod("GetUserNameWithUserCode",String.class);
        String s2= m2.invoke(obj,new Object[]{"Test"}).toString();
        
        //静态方法的调用
        Method m3=clazz.getMethod("GetClassName",String.class);
        String s3= m3.invoke(null,new Object[]{"Test"}).toString();
        
        System.out.println(s1);
        System.out.println(s2);
        System.out.println(s3);
   } 
catch (Exception e) {
     e.printStackTrace();
   }

```  

输出结果：  

```cte
fuwei_F0001
Test_fuwei_F0001
Test_Person
```
#### 使用反射实现动态代理     

为了更好的理解动态代理，首先要理解静态代理的逻辑，具体的实现示意图：   

![动态代理](/img/assets/Reflect/Reflect_flow.png)    


具体实现类代码如下：  

```java
interface ProxyInterface {
    public void doSomething();
}

//被代理者
class RealObj implements ProxyInterface {
    @Override
    public void doSomething() {
        System.out.println("doSomething");
    }

}

//代理者
class ProxyObj implements ProxyInterface {
    @Override
    public void doSomething() {
        System.out.println("before Exector");
        new RealObj().doSomething();
        System.out.println("after Exector");
    }

}


```

对应的调用代码： 

```java

@Test
public  void TestProxy(){
    CallMethod(new ProxyObj());

}

public  void CallMethod(ProxyInterface pi){
    pi.doSomething();
}

```


运行结果：

```cte
before Exector
doSomething
after Exector

```

在静态的代理中，可以看到是在代理类的内部使用了真实类的实例，来实现代理的功能，但这样就只能代理指定的类的类型，丧失了灵活性。如果我们能够在代理的时候把数据传入到代理类中，就可以动态的实现类的代理。 代码实现原理如下：    

```java
interface ProxyInterface {
    public void doSomething();
}

//被代理者
class RealObj implements ProxyInterface {
    @Override
    public void doSomething() {
        System.out.println("doSomething");
    }

}

//代理者
class ProxyObj implements InvocationHandler {
    
    private Object subject;
    public ProxyObj(Object subject)
    {
        this.subject = subject;
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        System.out.println("Before Exector");
        Object obj = method.invoke(subject, args);
        System.out.println("After Exector");

        return obj;
    }
}

```

调用的实现：

```java

    public  void TestProxy()
    {
        RealObj real = new RealObj();
        ProxyInterface proxy = (ProxyInterface) Proxy.newProxyInstance(
                ProxyInterface.class.getClassLoader(),
                new Class[]{ProxyInterface.class},
                new ProxyObj(real));
        proxy.doSomething();
    }

```


对于这个实现的原理可以参考这篇博客[细说JDK动态代理的实现原理
](http://blog.csdn.net/mhmyqn/article/details/48474815){:target=_blank}, 生成了一个继承自Proxy和实现了ProxyInterface方法的一个对象,具体的示意为：

```java
class proxy extends Proxy implements HelloWorld{
    ....
}

```


### 注解   

Java注解提供了关于代码的一些信息，但并不直接作用于它所注解的代码内容，常用的注解有可以参考：[Java注释Override、Deprecated、SuppressWarnings详解](http://www.cnblogs.com/zgqys1980/p/5264325.html)

#### 自定义注解

注解的大多使用情况都是结合反射，在Spring框架中也有很多都是使用反射+注解的方法来实现，下面为了更深入了解注解，我们可以自定义一个注解，注解在Java中的实现很简单：

```java
public @interface MyAnno   
{

}


```

只需要这样定义就可以直接使用这个注解 ，但这个是没有任何的实际意义。在这个注解中，可以添加对应的内部方法：    

```java

public @interface MyAnno  
{

    String value();
}


```
在使用的时候，我们就可以对value进行赋值：    

```java
@MyAnno(value = "test")
public  void TestReflect()
{

}

```


对于上面的代码，注解没有干涉内部代码的逻辑，但也没有起任何的作用。对于注解的使用，我们可以根据上面说到反射来实现我们的目的。比如，我们想实现一个注解为test的方法调用，可以先获得一个方法的所有注解，然后根据注解的value值来判断是否调用 ，下面是获得所有注解的方法:

```java

Method[] methods = clazz.getMethods();     
for (Method m : methods) {
    Annotation[] ans= m.getDeclaredAnnotations();
    for (Annotation an : ans)
    {
        System.out.println(an);
    }
}

```











