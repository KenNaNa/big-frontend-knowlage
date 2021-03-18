# MVVM 类 Vue 迷你框架（完结撒花）


- 处理数据响应式，分为
- 代理数据
- 依赖收集
- 触发更新
- 魔板编译，解析插值，解析指令，解析事件

完整的代码如下：

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

// 响应式数据
function defineReactive(obj, key, val) {
    observe(val); // 递归遍历
    const dep = new Dep(); // 每个key对应创建一个Dep实例
    let curVal = val;
    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target); // 建立watcher与dep的映射关系
            console.log(`get:${key}-${curVal}`);
            return curVal;
        },
        set(newVal) {
            if (newVal !== curVal) {
                observe(newVal);
                console.log(`set:${key}-${newVal}`);
                curVal = newVal;
                dep.notify(); // 通知更新
            }
        }
    })
}


function observe(obj) {
    new Observer(obj);
}

// 属性代理

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(val) {
                vm.$data[key] = val
            }
        })
    })
}

// MVue 类
class MVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data(); // 这里 data 是函数， 所以要执行取返回值

        // 对 data 选项做响应式处理
        observe(this.$data);

        // 代理数据
        proxy(this);

        // 编译模板
        new Compile(options.el, this);
    }
}

// Observer 用于管理 Watcher

class Observer {
    constructor(value) {
        this.$value = value
        if (Array.isArray(value)) {
            // 处理数组
            // array 覆盖原型，替换变更操作
            value.__proto__ = arrayCopyProto;

            // 对数组内容元素执行响应式
            value.forEach(item => observe(item));
        }
        if (typeof value === 'object') {
            // 处理对象
            this.walk(value);
        }
    }
    // 遍历对象，响应式处理
    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
    }
}

// Compile 编译类

class Compile {
    // 宿主元素
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;

        if (this.$el) {
            this.compile(this.$el);
        }
    }
    // 判断节点是不是含有 {{}} 的文本节点
    isInter(node) {
        return node.nodeType === 3 && /{{.+}}/.test(node.textContent);
    }
    update = (node, key, dir) => {
        const fn = this[dir + 'Updater']; // 查找指令
        fn && fn(node, this.$vm[key]);

        // 更新函数
        new Watcher(this.$vm, key, (val) => {
            fn && fn(node, val);
        });
    }
    textUpdater(node, val) {
        node.textContent = val;
    }
    htmlUpdater(node, val) {
        node.innerHTML = val;
    }
    // 插值语法编译
    compileText = (node) => {
        let res = /{{(.+)}}/.exec(node.textContent)
        console.log("res===>", res)
        this.update(node, res[1], 'text');
    }

    // 递归传入节点，根据节点类型做不同操作
    compile = (el) => {
        // 拿到子节点
        const childNodes = el.childNodes;
        childNodes.forEach(node => {
            if (node.nodeType === 1) {
                console.log('元素节点', node.nodeName);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                debugger
                this.compileText(node);
                console.log('文本节点', node.textContent);
            }

            if (node.childNodes) {
                this.compile(node);
            }
        });
    }


    text = (node, key) => {
        this.update(node, key, 'text');
    }

    html = (node, key) => {
        this.update(node, key, 'html');
    }

    // 节点元素的编译
    compileElement(node) {
        const nodeAttrs = Array.from(node.attributes);
        nodeAttrs.forEach(attr => {
            const { name, value } = attr;
            // 指令处理
            if (name.startsWith('m-')) {
                const dir = this[name.slice(2)]; // 找出指令方法
                dir && dir(node, value);
            }
            // 事件处理
            if (name.startsWith('@')) {
                // 找出开头是 @ 的指令，例如 @click
                const dir = name.slice(1);
                // 事件监听
                this.eventHandler(node, value, dir);
            }
        })
    }

    // 绑定监听函数
    eventHandler = (node, value, dir) => {
        const { methods } = this.$vm.$options;
        const fn = methods && methods[value];
        fn && node.addEventListener(dir, fn.bind(this.$vm));
    }

    // 解析 model
    modelUpdater(node, val) {
        node.value = val;
    }
    model = (node, key) => {
        this.update(node, key, 'model');
        node.addEventListener('input', e => {
            this.$vm[key] = e.target.value
        });
    }
}

// Watcher 类
// 检测数据变化

class Watcher {
    constructor(vm, key, updater) {
        this.$vm = vm;
        this.$key = key;
        this.$updater = updater;

        Dep.target = this; // 将当前实例指定在Dep的静态属性上
        vm[key]; // 读一下触发get
        Dep.target = null; // 置空
    }

    // 未来更新 dom 的函数，由 dep 调用
    update = () => {
        this.$updater.call(this.$vm, this.$vm[this.$key])
    }
}

// 依赖收集

class Dep {
    constructor() {
        this.deps = [];
    }
    addDep = (watcher) => {
        this.deps.push(watcher);
    }

    notify = () => {
        this.deps.forEach(watcher => watcher.update())
    }
}
```
