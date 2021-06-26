# 1. 为什么要优化
双向绑定是一柄双刃剑，提高开发效率的同时，也牺牲了性能。当然，随着硬件性能的提升，Angular自身性能的提升，对于一般（中小）复杂度的应用，性能问题可以忽略不计。但是对于特殊场景，或复杂页面来说，我们就需要单独的处理数据绑定问题，否则就会有卡顿的现象，影响用户体验。

# 2. 编程习惯方面
平时的一些小技巧，小习惯，都可以改善Angular绑定方面的性能。

# 2.1. NgForOf，加入trackBy提升性能
trackBy定义如何跟踪可迭代项的更改的函数。在迭代器中添加、移动或删除条目时，指令必须重新渲染适当的 DOM 节点。为了最大程度地减少 DOM 中的搅动，仅重新渲染已更改的节点。

默认情况下，变更检测器假定对象实例标识可迭代对象。提供此函数后，指令将使用调用此函数的结果来标识项节点，而不是对象本身的标识。

# 2.2. Angular数据绑定的三种方式

```ts
<div>
    <span>Name {{item.name}}</span>  <!-- 1. 直接绑定 -->
    <span>Classes {{item | classPipe}}</span><!-- 2. pipe方式-->
    <span>Classes {{classes(item)}}</span><!-- 3.绑定方法调用的结果 -->
</div>
```

- 直接绑定： 大多数情况下，这都是性能最好的方式。
- 绑定方法调用的结果：在每个脏值检测过程中，classes方程都要被调用一遍。如果没有特殊需求，应尽量避免这种使用方式。
- pipe方式： 它和绑定function类似，每次脏值检测classPipe都会被调用。不过Angular给pipe做了优化，加了缓存，如果item和上次相等，则直接返回结果。

```html
<li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
```
# 2.3. 除非需要，都是用单向绑定，减少监控值的个数
对于一般数据来说，都是只需要展示给用户，不需要修改。那么对于这部分数据，使用单向绑定即可(ts->html).
如：

```ts
<!-- 也称插值绑定 -->
 <span>{{yourMessage}}</span>
```
# 3. ChangeDetectionStrategy.OnPush 进行性能提升
对于一些很复杂的页面，上面的小技巧就不够用了，不过Angular也是考虑到这些了，提供了不少方法。
Angular 对比 AngularJS 在变化检测上由原来的双向检测(父->子，子->父)变为了单向(父->子)。所以每一次变化检测都会确定性地收敛。
Angular定义一个组件时，可以传入一个变化检测配置项为

```ts
changeDetection: ChangeDetectionStrategy.OnPush | ChangeDetectionStrategy.Default;
```


onpush策略只判断输入的引用(如果是object)是否改变，来判断是否进行脏检查。因此，我们可以使用onpush策略来减少变化检测的开销。

# 4. 利用ngzone-runOutsideAngular优化

Angular依赖NgZone来监听异步操作，并从根部执行变化检测。换句话说，我们代码中的每一个 addEventListener都会触发脏检查。但是如果我们非常明确，有些addEventListener要执行的东西，不会（或者说可以忽略）影响数据结果，不想然他触发脏检查。比如监测scroll，监测鼠标事件等。

针对这种情况， 我们可以使用zone提供的runOutsideAngular，让这些事件不触发脏检查。

```ts
this.zone.runOutsideAngular(() => {
    window.document.addEventListener('mousemove', this.bindMouse);
});
```
# 5. 手动控制脏检查 ChangeDetectorRef

Angular的ChangeDetectorRef实例上提供了可以绑定或解绑某个组件脏检查的方法。



```ts
class ChangeDetectorRef {
  markForCheck() : void     // 通知框架进行变化检查/Change Detection
  detach() : void           // 禁止脏检查
  detectChanges() : void    // 手工触发脏检查， 从该组件到各个子组件执行一次变化检测
  checkNoChanges() : void
  reattach() : void         // detach逆操作，启用脏检查
}
```

# 6. 总结
- 平时的一些小习惯，都可以提高angular的性能；
- 针对复杂应用，或者当出现卡顿时，我们也是有办法的！













