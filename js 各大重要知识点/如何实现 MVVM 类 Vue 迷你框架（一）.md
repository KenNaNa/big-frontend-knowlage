# 如何实现 MVVM 类 Vue 迷你框架（一）

MVVM 框架的三大要素：
- 数据响应式
 	- 使用 Object.defineProperty 属性
   - 使用 ES6 Proxy 
   - 监听数据变化，更新到视图上
- 模板插值
  - 提供模板语法与数据绑定
  - 插值：{{ }}
  - 指令：v-bind,v-model 等等。
- 模板渲染
	- 如果将模板转成 html
   - 将实际数据替换到模板插值中
   - 渲染
 	- 模板-> vdom -> real dom
    
# 初体验响应式

```js
function defineReactive(obj, key, value) {
	Object.defineProperty(obj, key, {
   		get() {
      		// 获取数据
         return obj[key]
      },
      set(newValue) {
      		// 设置数据
         if(value !== newValue) {
         	value = newValue
         }
      }
   })
}
```

测试一下数据是否被真的拦截

```js
const obj = {};
defineReactive(obj, 'name', 'ken');
obj.foo; // name
obj.foo = 'KenNaNa'; // KenNaNa
```
