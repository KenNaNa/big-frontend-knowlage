# Vue 源码解析 （九）响应式研究（一）

如何给一个对象设置响应式呢，我们需要将这个对象重新定义，所以就需要一个用于定义属性的方法，这个方法在 Vue 源码中是 def

# def

```js
/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

在 Vue 源码中，我们看到对数组进行重新处理

- push
- pop
- shift
- unshift
- splice
- sort
- reverse


那么 Vue 是怎么处理的呢？

- 拿到 Array.protorype 原始数组的原型
- 对原始数组原型进行拷贝

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
```

- 然后将这些方法逐个进行 def

```js
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

为什么上面会处理关于 push, unshift,splice 这三个方法，因为这三个函数有插入新元素的可能，所以需要对新元素进行响应式处理


所以你会看到

```js
const ob = this.__ob__
if(inserted) ob.observeArray(inserted)
```

最后通知变化，进行更行

```js
// notify change
ob.dep.notify()
```
