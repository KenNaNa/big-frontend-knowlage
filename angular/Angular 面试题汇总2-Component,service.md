# css样式的作用域、Shadow DOM
Shadow DOM是HTML规范的一部分，它允许开发人员封装自己的HTML标记，CSS样式和JavaScript。创建样式Component时，可以通过设置，启用。

```ts
@Component({
  selector: 'my-app',
  template: `
    <h1>Hello World!</h1>
    <span class="red">Shadow DOM Rocks!</span>
  `,
  styles: [`
    :host {
      display: block;
      border: 1px solid black;
    }
    h1 {
      color: blue;
    }
    .red {
      background-color: red;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
class MyApp {
}
```

ViewEncapsulation可选值：

- ViewEncapsulation.Emulated - 通过 Angular 提供的样式包装机制来封装组件，使得组件的样式不受外部影响。这是 Angular 的默认设置。
- ViewEncapsulation.Native - 使用原生的 Shadow DOM 特性。但需要考虑浏览器是否支持。
- ViewEncapsulation.None - 无 Shadow DOM，并且也无样式包装

# 关于Angular Service
服务（Service）充当着数据访问，逻辑处理的功能。把组件和服务区分开，以提高模块性和复用性。

# 单例服务（singleton）
使用Angular CLI创建服务，默认会创建单例服务；

把 @Injectable() 的 providedIn 属性声明为 root, 即为单例服务。

单例服务（singleton）对象，可以用于临时存放全局变量。 对于复杂的全局变量，推荐使用状态管理组件（state management - Ngrx）。

# forRoot() 模式
如果多个调用模块同时定义了 providers (服务)，那么在多个特性模块中加载此模块时，这些服务就会被注册在多个地方。这会导致出现多个服务实例，并且该服务的行为不再像单例一样 。有多种方式来防止这种现象：

- 用 providedIn 语法代替在模块中注册服务的方式。
- 把服务分离到它们自己的模块中。
- 在模块中分别定义 forRoot() 和 forChild() 方法。
- 














