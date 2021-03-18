# 如何实现 MVVM 类 Vue 迷你框架（七）


还有一件事件我们忘记处理，就是对数组的处理，Vue 内部处理一些数组方法，例如：push,pop,reverse,shift,unshift,sort,splice

- 找到原型上的方法
- 拷贝新的原型
- 在新的原型上对这些方法进行重写，这样就不会覆盖原有数组的原型
- 通知更新操作

```js
// 数组响应式处理
// push, pop, reverse, shift, sort, splice, unshift
const arrayMethods = ["push", "pop", "reverse", "shift", "unshift", "sort", "splice"];
const originProto = Array.prototype;
const arrayCopyProto = Object.create(originProto);

arrayMethods.forEach(method => {
    arrayCopyProto[method] = function () {
        // 原始操作
        originProto[method].apply(this, arguments);

        // 通知更新操作
    }
})
```

我们需要在 Observer 类处理

```js
class Observer {
    constructor(value) {
        this.$value = value
        if (Array.isArray(value)) {
            // 处理数组
            // array 覆盖原型，替换变更操作
            value.__proto__ = arrayCopyProto;

            // 对数组内容元素执行响应式
            value.forEach(item => observe(item));
        } else {
            // 处理对象
            this.walk(value);
        }
    }
    // 遍历对象，响应式处理
    walk(obj) {
        Object.keys.forEach(key => defineReactive(obj, key, obj[key]));
    }
}
```
