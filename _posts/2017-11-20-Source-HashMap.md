---
layout: post
title: HaspMap的原理
date: 2017-11-20
keywords: "HaspMap的原理|实现HaspMap|HashMap源码|手工实现HashMap"
description: "Java中HashMap的原理"
tags:
     - Java 
author: '老付'
---   

### 实现简单的Map   
-----------------------
 前几天有想法弄懂HashMap的实现的原理，我自己也YY了一个想法去实现一个简单的Map， 代码如下：     

```java
public class KeyValuePair<K,V> {
	
	public  K Key;
	public  V Value;
	
	public K getKey() {
		return Key;
	}
	
	public void setKey(K key) {
		Key = key;
	}
	
	public V getValue() {
		return Value;
	}
	
	public void setValue(V value) {
		Value = value;
	}
}

```  
然后使用List作为Container对数据进行存储，主体的内部实现原理如下：      

```java
public class MyMap<K, V> {
	private List<KeyValuePair<K, V>> map;
	
	public MyMap() {
		map = new ArrayList<KeyValuePair<K, V>>();
	}
	
	public V put(K k, V v) {
		KeyValuePair<K, V> keyValuePair = new KeyValuePair<K, V>();
		keyValuePair.setKey(k);
		keyValuePair.setValue(v);
		map.add(keyValuePair);
		return v;
	}
	
	public V get(K k) {
		for (KeyValuePair pair : map) {
			if (pair.getKey().equals(k)) {
				return (V) pair.getValue();
			}
		}
		return null;
	}
}

```

虽然也能实现类似的效果，但我们可以看到这个的map的时间复杂度是O(n)，当集合数量很大时，则效率可以的非常的糟糕，下面做一个对比的测试：  

```java
@Test
public void MapTest(){
	
	long start=System.currentTimeMillis();
	MyMap<String,String> map =new MyMap();
	for (int i=0;i<10000;i++){
		map.put("Key"+i,"value"+i);
	}
	for (int i=0;i<10000;i++){
		map.get("Key"+i);
	}
	long end=System.currentTimeMillis();
	System.out.println("耗时："+(end-start));
	
	 start=System.currentTimeMillis();
	Map<String,String> hashMap =new HashMap<>();
	for (int i=0;i<10000;i++){
		hashMap.put("Key"+i,"value"+i);
	}
	for (int i=0;i<10000;i++){
		hashMap.get("Key"+i);
	}
	end=System.currentTimeMillis();
	System.out.println("耗时："+(end-start));
}
```   

运行结果如下：    

```cte
耗时：1815
耗时：14
```    

整整慢了100多倍！    

### HashMap的实现原理     
----------------------------

对于上面的代码，我们应该知道性能最慢的是查找对应的key值，对于ArrayList来说，可能插入也是很大的性能消耗。在JDK中使用一个数组来存储key,索引是根据Key的Hash值来确定，而每一个key对应数据单元是一个链表。用图表示效果如下：  

![HaspMap的原理](/img/assets/HashMap/HashMap.png)

下面我们JDK的原理进行分析：   

#### 存值 

1. 首先定义一个数组，其类型是一个Key-Value类型      

2. 根据key的Hash值来确定当前的索引     

3. 根据索引值来判断当前是否有值，如果当前有值则把当前的值插入当前数据之前

#### 取值     

1.根据key的Hash值来确定当前的索引,根据索引来找到链表的首节点     

2.遍历链表，找到指定的Key对应的节点，取出当前值



具体的实现代码如下（可以利用上面的代码）：    

```java
public class KeyValuePair<K,V> {
	
	public  K Key;
	public  V Value;
	public KeyValuePair next;
	
	public KeyValuePair getNext() {
		return next;
	}
	
	public void setNext(KeyValuePair next) {
		this.next = next;
	}
	public KeyValuePair(){
	
	}
	public KeyValuePair(K k, V v){
		this.Key=k;
		this.Value=v;
	}
	public K getKey() {
		return Key;
	}
	
	public void setKey(K key) {
		Key = key;
	}
	
	public V getValue() {
		return Value;
	}
	
	public void setValue(V value) {
		Value = value;
	}
}

``` 

HashMap的实现：
```java   
public class MyHashMap<K, V> {
	
	private  int defalutLength = 16;
	private int size;
	private KeyValuePair<K, V>[] arr;
	public MyHashMap() {
		arr = new KeyValuePair[defalutLength];
		size = 0;
	}
	
	public V put(K k, V v) {
		int index = findIndex(k);
		//todo:find out of index
		if (arr[index] == null) {
			arr[index] = new KeyValuePair(k, v);
		} else {
			KeyValuePair tempPair = arr[index];
			arr[index] = new KeyValuePair(k, v);
			arr[index].setNext(tempPair);
		}
		size++;
		return v;
	}
	
	private int findIndex(K key) {
		int index=key.hashCode() % defalutLength;
		return index>0?index:(-1)*index;
	}
 
	public V get(K k) {
		int index = findIndex(k);
		if (arr[index] == null) {
			return null;
		}
		KeyValuePair<K, V> current = arr[index];
		while (current.next != null) {
			if (current.getKey().equals(k)) {
				return current.getValue();
			}
			current = current.next;
		}
		return null;
	}
	public  int size(){
		return this.size;
	}
	
}

```     

同样我们修改测试的代码:   
```java
@Test
public void MapTest(){
		
	long start=System.currentTimeMillis();
	MyMap<String,String> map =new MyMap();
	for (int i=0;i<10000;i++){
		map.put("Key"+i,"value"+i);
	}
	for (int i=0;i<10000;i++){
		map.get("Key"+i);
	}
	long end=System.currentTimeMillis();
	System.out.println("耗时："+(end-start));
	
	 start=System.currentTimeMillis();
	Map<String,String> hashMap =new HashMap<>();
	for (int i=0;i<10000;i++){
		hashMap.put("Key"+i,"value"+i);
	}
	for (int i=0;i<10000;i++){
		hashMap.get("Key"+i);
	}
	end=System.currentTimeMillis();
	System.out.println("耗时："+(end-start));
	 
	
	
	start=System.currentTimeMillis();
	MyHashMap<String,String> myhashMap =new MyHashMap<>();
	for (int i=0;i<10000;i++){
		myhashMap.put("Key"+i,"value"+i);
	}
	for (int i=0;i<10000;i++){
		myhashMap.get("Key"+i);
	}
	end=System.currentTimeMillis();
	System.out.println("耗时："+(end-start));
	 
}
```   

运行结果：  

```cte
耗时：2337
耗时：26
耗时：337
```  

我们看到我们使用的链表在插入数据的时候进行整理，极大的提高了Map的效率，但离Jdk的性能还有很大的差距。  


### 优化散列算法    
---------------------
对于Map的查找的性能的瓶颈主要在最后的链表的查找，我们可以把Key的数据进行扩大，让Key分布的更加平均，这样就能减少最后链表迭代次数，实现思路：

1. 添加一个报警百分比，当key的使用率长度大于当前的比例，我们对key的数组进行扩容

2. 扩容后对原来的Key进行重新散列

修改后代码如下：   

```java
public class MyHashMap<K, V> {
	
	private  int defalutLength = 16;
	private final double defaultAlfa = 0.75;
	private int size;
	private int arrLength;
	private KeyValuePair<K, V>[] arr;
	
	public MyHashMap() {
		arr = new KeyValuePair[defalutLength];
		size = 0;
		arrLength=0;
	}
	
	public V put(K k, V v) {
		int index = findIndex(k);
		//todo:find out of index
		if(arrLength>defalutLength*defaultAlfa){
			extentArr();
		}
		if (arr[index] == null) {
			arr[index] = new KeyValuePair(k, v);
			arrLength++;
		} else {
			KeyValuePair tempPair = arr[index];
			arr[index] = new KeyValuePair(k, v);
			arr[index].setNext(tempPair);
		}
		size++;
		return v;
	}
	
	private int findIndex(K key) {
		
		int index=key.hashCode() % defalutLength;
		return index>0?index:(-1)*index;
	}
	private void extentArr(){
		  defalutLength=defalutLength*2;
		KeyValuePair<K, V>[] newArr=new KeyValuePair[defalutLength];
		for (int i=0;i<defalutLength/2;i++){
			if(arr[i]!=null){
				int index= findIndex(arr[i].getKey());
				newArr[index]=arr[i];
			}
		}
		arr=newArr;
	}
	public V get(K k) {
		int index = findIndex(k);
		if (arr[index] == null) {
			return null;
		}
		
		KeyValuePair<K, V> current = arr[index];
		while (current.next != null) {
			if (current.getKey().equals(k)) {
				return current.getValue();
			}
			current = current.next;
		}
		return null;
	}
	public  int size(){
		return this.size;
	}
	
}

```   

最终测试性能结果如下:    
```cte
耗时：2263
耗时：23
耗时：33
```

性能已经很接近了，至于为什么有差异，可能jdk有其它更多的优化（比如当链表长度大于8时，使用红黑树），但本文就讨论到这里。












