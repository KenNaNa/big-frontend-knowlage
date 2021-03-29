[Virtual DOM和snabbdom.js](https://www.jianshu.com/p/1f1ef915e83e)

# 什么是虚拟dom

虚拟DOM是一种使用js对象来描述真实DOM的技术，通过这种技术，一方面我们能精确知道哪些真实DOM改变了，从而尽量减少DOM操作的性能开销。

另外一方面由于真实DOM都通过js对象来描述了，所以我们可以尝试使用数据来驱动DOM开发，比如著名的react就是这样做的。



# 为什么要减少操作DOM开销呢？

首先这个和浏览器的架构有关系，在webkit的浏览器架构中DOM模块和js的模块是互相独立且分割的，因此每次操作DOM的开销要比单纯的操作一次js开销要大。
其次在整个前端项目中，浏览器的重绘和重排性能开销最大，因此尽量减少浏览器的重绘和重排是前端项目在做性能优化的时候的重点。
最后目前大型页面／单页应用里动态创建／销毁 DOM 很常见，而在之前的jquery时代，经常会出现因为列表中的一项改变而重置整个列表的dom，因此减少操作DOM开销在现在的前端开发中显得十分必要。


# 为什么是snabbdom.js

如果要我们自己去实现一个虚拟dom，大概过程应该有以下三步：

- compile，如何把真实DOM编译成vnode。
- diff，我们要如何知道oldVnode和newVnode之间有什么变化。
- patch， 如果把这些变化用打补丁的方式更新到真实dom上去。
通过这三个阶段我们就可以观察一波snabbdom.js的源码。

# snabbdom.js结构总览

```js

src
├── helpers     
│   └── attachto.ts # 定义了AttachData，VNodeDataWithAttach ，VNodeWithAttachData 等数据结构
├── modules # 该文件夹中主要存放一些在更新dom差异的时候需要的操作     
│   ├── attributes.ts # 在vnode更新的时候，更新dom中的attrs操作。
│   ├── class.ts  # 在vnode更新的时候，更新dom中的class操作。
│   ├── dataset.ts # 在vnode更新的时候，更新dom中的dataset(自定义数据集)操作。
│   ├── eventlisteners.ts  # 在vnode更新的时候，更新dom中的eventlisteners(自定义数据集)操作。
│   ├── hero.ts # 在vnode更新的时候，和动画效果有关的支持
│   ├── module.ts # 定义的module结构
│   ├── props.ts # 在vnode更新的时候，更新dom中的props操作。
│   └── style.js # 在vnode更新的时候，更新dom中的style操作。
├── h.ts   # 帮助函数主要用来操作生成vnode的。
├── hooks.ts   # 定义snabbdom在运行的过程中hooks的模型。    
├── htmldomapi.ts # 对浏览器的dom的api进行二次包装，可以直接操作，html的dom的api。
├── is.ts # is函数主要是针对做一些数据类型判断，分 primitive和array类型。 
├── snabbdom.bundle.ts # snabbdom.ts、attributes、class、props、style 、eventListenersModule和h组成了这个ts文件。
├── snabbdom.ts # 主要文件，程序的主线逻辑都在这个文件里。
├── thunk.ts # thunk这个文件不知道干什么的，但是不影响理解主线逻辑。   
├── tovnode.ts   # 提供了toVNode的方法，把真实dom转化为vnode。
└── vnode.ts # 定义了vnode的模型和转化成为vnode的工具方法。 
```
从上面的代码结构，我们可以看到关于snabbdom.js中最主要的代码几个文件是h.ts，snabbdom.ts，tovnode.ts，vnode.ts。

# vnode.ts
vnode 是对 DOM 节点的抽象，既然如此，我们很容易定义它的形式：

```js
{
  type:String, // String，DOM 节点的类型，如 'div'/'span'
  data:Object,  // Object，包括 props，style等等 DOM 节点的各种属性
  children : Array // Array，子节点（子 vnode）
}
```
所以让我们来看下snabbdom.js中对vnode的实际定义又是怎么做的：

```js
export interface VNode {
  sel: string | undefined; // VNode的选择器，nodeName+id+class的组合
  data: VNodeData | undefined; // 存放VNodeData的地方，具体见下面的VNodeData定义
  children: Array<VNode | string> | undefined; // vnode的子vnode的地方
  elm: Node | undefined; // 存储vnode对应的真实的dom的地方
  text: string | undefined; // vnode的text文本，和children只能二选一
  key: Key | undefined; // vnode的key值，主要用于后续vnode的diff过程
}

export interface VNodeData {
  props?: Props; // vnode上传递的其他属性
  attrs?: Attrs; // vnode上的其他dom属性，可以通过setAttribute来设置或删除的。
  class?: Classes; // vnode上的class的属性集合
  style?: VNodeStyle; // vnode上的style属性集合
  dataset?: Dataset; // vnode挂载的数据集合
  on?: On;  // 监听的事件集合
  hero?: Hero; 
  attachData?: AttachData; // 额外附加的数据
  hook?: Hooks; // vnode的钩子函数集合，主要用于在不同阶段调用不通过的钩子函数
  key?: Key; 
  ns?: string; // for SVGs 命名空间，主要用于SVG
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  [key: string]: any; // for any other 3rd party module
}
```

继续往下看我们发现vnode.ts中不仅仅存在Vnode和VnodeData两个数据模型，还有一个vnode的工具方法，用于生成vnode。

```js
// 参数是sel，data，children，text，elm，返回值是一个VNode的对象
export function vnode(sel: string | undefined,
                      data: any | undefined,
                      children: Array<VNode | string> | undefined,
                      text: string | undefined,
                      elm: Element | Text | undefined): VNode {
  let key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children, text: text, elm: elm, key: key};
}
```

好了，现在我们已经有vnode和一个生成vnode的函数，接下来我们看看，如何把真实的dom转为vnode

# tovnode.ts

真实的dom转为vnode的方法存放在tovnode.ts的文件里，方法名是toVNode。

```js
// 参数是要求一个真实的dom对象
export function toVNode(node: Node, domApi?: DOMAPI): VNode {
  // 这边定义了一个变量叫api，主要是一些用于dom操作的api接口。
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;
  // 定义了text的变量
  let text: string;
  // 如果node是一个element类型的dom对象就进行如下的操作
  if (api.isElement(node)) {
    // 获得node的id，变成#id 
    const id = node.id ? '#' + node.id : '';
   // 获得class，变成.class1.class2这样的形式
    const cn = node.getAttribute('class');
    const c = cn ? '.' + cn.split(' ').join('.') : '';
   // sel 变成tagName+id+class的形式，比如<div id=id class=class></div>的sel的值就变成了div#id.class
    const sel = api.tagName(node).toLowerCase() + id + c;
   // 定义一系列后续需要使用的attrs，children等对象。
    const attrs: any = {};
    const children: Array<VNode> = [];
    let name: string;
    let i: number, n: number;
    // 获得元素里所有的attrs
    const elmAttrs = node.attributes;
   // 获得元素中所有子节点,这边不用children
    const elmChildren = node.childNodes;
    for (i = 0, n = elmAttrs.length; i < n; i++) {
      name = elmAttrs[i].nodeName;
      if (name !== 'id' && name !== 'class') {
        // 把非id和class的属性值放到attrs中 
        attrs[name] = elmAttrs[i].nodeValue;
      }
    }
    for (i = 0, n = elmChildren.length; i < n; i++) {
      // 通过递归的方式把子节点翻译成vnode放入children数组中
      children.push(toVNode(elmChildren[i], domApi));
    }
   // 生成完整的vnode并返回
    return vnode(sel, {attrs}, children, undefined, node);
  } else if (api.isText(node)) {
   // 如果node是一个textContent类型的就返回文本的vnode
    text = api.getTextContent(node) as string;
    return vnode(undefined, undefined, undefined, text, node);
  } else if (api.isComment(node)) {
   // 如果node是一个comment类型的就返回sel是"!"的文本的vnode
    text = api.getTextContent(node) as string;
    return vnode('!', {}, [], text, node as any);
  } else {
    // 如果什么都不是就返回一个空的vnode 
    return vnode('', {}, [], undefined, node as any);
  }
}
```
OK，现在我们已经知道了如何把一个真实的dom节点转化成为vnode，用js对象的方式生成vnode，可以看到有vnode的方法题目，但是单纯使用vnode函数来创建vnode比较繁琐，所以snabbdom就提供了相应的帮助函数来方便我们创建vnode，在h.ts中。

# h.ts

```js
 // 以下所有代码到函数体为止都做了一件事情，对h这个函数进行重载，看不懂的可以去理解下typescript
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}, children: any, text: any, i: number;
  // 以下一串if判断主要用于规范参数的形式，统一转化。
  if (c !== undefined) {
    data = b;
    if (is.array(c)) { children = c; }
    else if (is.primitive(c)) { text = c; }
    else if (c && c.sel) { children = [c]; }
  } else if (b !== undefined) {
    if (is.array(b)) { children = b; }
    else if (is.primitive(b)) { text = b; }
    else if (b && b.sel) { children = [b]; }
    else { data = b; }
  }
 // 对文本或者数字类型的子节点进行转化
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  // 针对svg的node进行特别的处理
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel);
  }
 // 返回一个正常的vnode对象。
  return vnode(sel, data, children, text, undefined);
};
```

以上，我们已经有了各种方法来生成一个vnode，包括从普通js对象生成，从真实的dom来生成。但是我们怎么从vnode生成真实的dom呢？接下来让我们来看看snabbdom.js中最重要的主代码snabbdom.ts。

# snabbdom.ts

利用vnode生成真实dom在snabbdom中主要是通过createElm方法来实现，该方法放在snabbdom.ts中。

```js
  //根据VNode创建element
  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    let i: any, data = vnode.data;
    if (data !== undefined) {
      //如果VNodeData存在且hooks里有init函数,则执行init函数,然后重新赋值VNodeData
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode);
        data = vnode.data;
      }
    }
    // 子虚拟dom,
    let children = vnode.children, sel = vnode.sel;
    // 当sel == "!"的时候表示这个vnode就是一个comment
    if (sel === '!') {
      if (isUndef(vnode.text)) {
        vnode.text = '';
      }
      vnode.elm = api.createComment(vnode.text as string);
    } else if (sel !== undefined) {
      // Parse selector 这么一段就是为了从sel中获得tag值,id值,class值
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns) ? api.createElementNS(i, tag)
                                                                               : api.createElement(tag);
      // 设置元素的id
      if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
      // 设置元素的class
      if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
      // 调用create钩子
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            //深度遍历
            api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
          }
        }
      } else if (is.primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      i = (vnode.data as VNodeData).hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        //当insert的hook存在,就在插入Vnode的队列中加入该vnode
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      // 其他的情况就当vnode是一个简单的TextNode
      vnode.elm = api.createTextNode(vnode.text as string);
    }
    return vnode.elm;
  }
```
OK到现在为止，我们已经把complie的阶段弄的差不多了，现在只剩下，怎么比较 oldVnode 与 newVnode 两个 vnode，并实现 DOM 树更新？也就是我们前面提到的diff方法和patch过程，在snabbdom.ts，diff和patch都写在一起，我们继续往下看。

```js
  // patch过程
  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
    let i: any, hook: any;
    // 调用全局hook里定义的事件的地方。
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    // 因为 vnode 和 oldVnode 是相同的 vnode，所以我们可以复用 oldVnode.elm。
    const elm = vnode.elm = (oldVnode.elm as Node);
    let oldCh = oldVnode.children;
    let ch = vnode.children;
    if (oldVnode === vnode) return;
    if (vnode.data !== undefined) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    // 如果 vnode.text 是 undefined
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        // 核心逻辑（最复杂的地方）：怎么比较新旧 children 并更新，对应上面
        // 的数组比较
        if (oldCh !== ch) updateChildren(elm, oldCh as Array<VNode>, ch as Array<VNode>, insertedVnodeQueue);
        // 添加新 children
      } else if (isDef(ch)) {
        // 首先删除原来的 text
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        // 然后添加新 dom（对 ch 中每个 vnode 递归创建 dom 并插入到 elm）
        addVnodes(elm, null, ch as Array<VNode>, 0, (ch as Array<VNode>).length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        // 相反地，如果原来有 children 而现在没有，那么我们要删除 children。
        removeVnodes(elm, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);
      } else if (isDef(oldVnode.text)) {
        // 最后，如果 oldVnode 有 text，删除。
        api.setTextContent(elm, '');
      }
      // 否则 （vnode 有 text），只要 text 不等，更新 dom 的 text。
    } else if (oldVnode.text !== vnode.text) {
      api.setTextContent(elm, vnode.text as string);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  // diff算法的重点
  function updateChildren(parentElm: Node,
                          oldCh: Array<VNode>,
                          newCh: Array<VNode>,
                          insertedVnodeQueue: VNodeQueue) {
    // parentElm:Node
    // oldCh: Array<VNode>
    // newCh: Array<VNode>
    // insertdVnodeQuenen: VNodeQuenen
    // 和patchVnode形成了精巧递归
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx: any;
    let idxInOld: number;
    let elmToMove: VNode;
    let before: any;

    // 当oldCh和newCh其中还有一个没有比较完的话，就执行下的函数
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 把获得更新后的 (oldStartVnode/newEndVnode) 的 dom 右移，移动到
        // oldEndVnode 对应的 dom 的右边。为什么这么右移？
        // （1）oldStartVnode 和 newEndVnode 相同，显然是 vnode 右移了。
        // （2）若 while 循环刚开始，那移到 oldEndVnode.elm 右边就是最右边，是合理的；
        // （3）若循环不是刚开始，因为比较过程是两头向中间，那么两头的 dom 的位置已经是
        //     合理的了，移动到 oldEndVnode.elm 右边是正确的位置；
        // （4）记住，oldVnode 和 vnode 是相同的才 patch，且 oldVnode 自己对应的 dom
        //     总是已经存在的，vnode 的 dom 是不存在的，直接复用 oldVnode 对应的 dom。
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm as Node, api.nextSibling(oldEndVnode.elm as Node));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        //更新新旧vnode的值，然后vnode左移
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key as string];
        // 新的children中的startVnode元素没有在旧children中找到
        if (isUndef(idxInOld)) { // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          newStartVnode = newCh[++newStartIdx];
        } else {
          // 新的children中的startNode元素在旧children中找到元素
          elmToMove = oldCh[idxInOld];
          // 如果sel不相等则必须重新创建一个新的ele
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          } else {
            // 更新操作
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.insertBefore(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
```

在上述的操作中，有一个重要的函数叫sameVnode，十分重要，对diff算法的影响十分巨大，通常情况下，找到两棵任意的树之间最小修改的时间复杂度是 O(n^3)，这不可接受。幸好，我们可以对 Virtual DOM 树有这样的假设：
如果 oldVnode 和 vnode 不同（如 type 从 div 变到 p，或者 key 改变），意味着整个 vnode 被替换（因为我们通常不会去跨层移动 vnode ），所以我们没有必要去比较 vnode 的 子 vnode（children） 了。基于这个假设，我们可以 按照层级分解 树，这大大简化了复杂度，大到接近 O(n) 的复杂度：


此外，对于 children （数组）的比较，因为同层是很可能有移动的，顺序比较会无法最大化复用已有的 DOM。所以我们通过为每个 vnode 加上 key 来追踪这种顺序变动。

因为以上的两个假设，所以sameVnode方法的源代码如下：

```js
// 只要这两个虚拟元素的sel(选择器)和key一样就是same的
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
```

至此，源代码的主要逻辑已经梳理完毕，想要看完整的snabbdom源代码或者更有有关Virtual DOM可以查看参考文章。

# 参考文章
- snabbdom源代码
- 探索Virtual DOM的前世今生
- Why Turbine doesn't use virtual DOM
- 如何看待 snabbdom 的作者开发的前端框架 Turbine 抛弃了虚拟DOM？

作者：种谔
链接：https://www.jianshu.com/p/1f1ef915e83e
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
