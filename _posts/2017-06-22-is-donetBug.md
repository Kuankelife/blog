---
layout: post
title: 是不是.Net的bug?
date: 2017-06-22
tags:
     - .Net
author: '老付'
---      

####  背景   

  在搬砖的过程中碰到一个问题，定义了一个string类型TicketCount的字段，使用orm框架从数据库里面拿去对应的值(使用Sql中的Count()函数)，然后使用int.Parse转化成整型时发现报错。调试发现TicketCount为整型，类型发生了变化，不可思议。目前正在查询Orm转换的逻辑，初步把转换的函数简化如下,但目前代码还没有运行成功，继续深挖中：    

  ``` C#      

        internal delegate void DynamicFieldSetHandler(object obj, object value);
        private static void Main(string[] args)
        {


            var obj = (object) 4;
            var t = new Test(); 


            DynamicMethod setDynamicMethod = new DynamicMethod("DynamicSet", typeof (void), new Type[2]
            {
                typeof (object),
                typeof (object)
            }, typeof(Test), true);
           
            var fieldInfo = t.GetType().GetFields(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)[0];
            ILGenerator ilGenerator = setDynamicMethod.GetILGenerator();
            ilGenerator.Emit(OpCodes.Ldarg_0);
            ilGenerator.Emit(OpCodes.Ldarg_1);
            //OpCodesFactory.UnboxIfNeeded(ilGenerator, fieldInfo.FieldType);
            ilGenerator.Emit(OpCodes.Unbox_Any, fieldInfo.FieldType);
            ilGenerator.Emit(OpCodes.Stfld, fieldInfo);
            ilGenerator.Emit(OpCodes.Ret);
            var setValue = (DynamicFieldSetHandler)setDynamicMethod.CreateDelegate(typeof(DynamicFieldSetHandler));
            setValue((object)t, obj);
            Console.ReadKey();
        }j);


  ```      

   环境：windows7+vs2010+.net 4+mysql

#### 场景复原           
 
1. 定义一个类型：       

     ![class](/img/assets/class.png)   


2. 使用orm工具查询结果：        

     ![intResult](/img/assets/intResult.png)   
 


3. 用即时窗口测试：     


  
	 ![test1](/img/assets/Test1.png)    

	 ![test2](/img/assets/Test2.png)