---
layout: post
title: 多线程如何排队执行
date: 2017-06-26
keywords: "多线程如何排队执行|多线程排队|多线程顺序"
description: "程序会有一个非常耗时的操作，但要求耗时的操作完成后，再顺序的执行一个不耗时的操作，而且这个程序的调用，可能存在同时调用的情况"
tags:
     - .Net
author: '老付'
---    
 

###  场景        

   有一个这样场景，程序会有一个非常耗时的操作，但要求耗时的操作完成后，再顺序的执行一个不耗时的操作，而且这个程序的调用，可能存在同时调用的情况。      

   具体的模型如下：        


   ![moxing](/img/assets/task.png)          


   从Start开始触发了5个线程，经过一个longTimeJob同时执行，我们不关心longJob的执行时间和先后顺序，根据Start的先后顺序来执行一个ShortJob。下面我们用代码来模拟上面的过程。         

   举例说明：有ABCD 4个线程，进入的顺序也是ABCD，A耗时3s,B耗时7s,C耗时1s，D耗时3s. 所以如果当4个线程都同时开始执行时，完成的先后顺序为 CADB，但我们要求的顺序是ABCD,也就是说C要等待AB执行完后，才能继续后续的工作。

   我们可以用请求bing搜索来模拟longTimeJob，根据传入的序列来决定请求多少次，主要模拟方法如下：       

   ``` C#       

    private static async Task Test()
    {
        var arry = new[]
        {
            10, 9, 8, 7, 6, 5, 4, 3, 2, 1
        };
        var listTask = new List<Task<int>>();
        foreach (var i in arry)
        {
            var i1 = i;
            var task = Task.Run(() => DoJob(i1));

            listTask.Add(task);
        }

        foreach (var task in listTask)
        {
            Console.WriteLine("输出-->：" + await task);//
        }
    }     

    public static Task<int> DoJob(int o)
    {
        return Task.Run(() =>
        {
            DoLongTimeThing(o);
            return o;
        });
    }      

    public static void DoLongTimeThing(int i)
    {
        Console.WriteLine("执行-->：" + i);
        for (int j = 0; j < i; j++)
        {
            HttpGet("http://cn.bing.com/");
        }

        Console.WriteLine("执行完毕-->：" + i);
    }

    public static string HttpGet(string url)
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            string content = reader.ReadToEnd();
            return content;
        }
        catch (Exception e)
        {
            return e.Message;
        }

    }



   ```       

   执行结果：    

   ![taskjob](/img/assets/taskJob.png)    


   上面的代码大概能解决我们的问题，有一个问题，对于客户的调用我们无法形成一个List，而且list是线程安全的，所以针对上述的方法在实际的业务场景中无法使用。       


### 新思路    

   我们无法实现一个有序的Task列表，如果换一个角度考虑，当一个任务形成的时间，同时生成一个对应的HashCode,对HashCode进行一个队列的入队操作，当执行完成longTimeJob后，判断是不是队列的第一个Task的HashCode,如果是则执行，如果不是则继续等待，切换线程。 具体如下思路如下图：      

   ![queue](/img/assets/quenuPic.png)     



   ```  C#        

    public static Queue<string> Queue = new Queue<string>();
	static void Main(string[] args)
	{
	    var arry = new[]
	    {
	        10, 9, 8, 7, 6, 5, 4, 3, 2, 1
	    };

	    foreach (var i in arry)
	    {
	        Console.WriteLine("进入Job顺序-->：" + i);
	        Test(i);
	    }
	    Console.ReadKey();
	}

	public static void Test(int i)
	{
	    var taskId = Guid.NewGuid().ToString();
	    Queue.Enqueue(taskId);
	    Task.Factory.StartNew(DoJob, new object[] { i, taskId });
	}
	public static void DoJob(object o)
	{
	    var oArry = (object[])o;
	    var n = (int)oArry[0];
	    var currId = oArry[1].ToString();

	    DoLongTimeThing(n);//

	    while (currId != Queue.Peek())
	    {
	        Thread.Sleep(1);//等线程切换
	    }

	    Console.WriteLine("DoShortJob输出-->：" + n);//
	    //请求数据库 
	    Queue.Dequeue();
	}
	public static void DoLongTimeThing(int i)
	{
	    Console.WriteLine("LongTimeJob执行-->：" + i);
	    for (int j = 0; j < i; j++)
	    {
	        HttpGet("http://cn.bing.com/");
	    }
	    Console.WriteLine("LongTimeJob执行完毕-->：" + i);
	}


	public static string HttpGet(string url)
	{
	    try
	    {
	        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
	        request.Method = "GET";

	        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
	        StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
	        string content = reader.ReadToEnd();
	        return content;
	    }
	    catch (Exception e)
	    {
	        return e.Message;
	    }

	}


   ```            


   运行结果如下：      

   ![queue](/img/assets/Quene.png)       



   虽然执行结果看起来很乱，但仔细比对可以发现最终的DoShortTime是按顺序执行的。











