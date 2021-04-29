# 如何编写一个 vue3 插件

作为 vue3 的插件，需要使用如下语法：

```js
import {createApp} from 'vue

const app = createApp(component, props)

app.use(plugin)
```

上面例子我们了解到，createApp 有两个参数，一个是组件模板 component, 一个是组件模板的 props 属性。

为什么可以 use 呢？因为 vue3 内部有一个 install 方法，用于安装扩展三方插件使用的

- 首先这个插件拥有属于自己的模板也就是我们的 .vue 文件

这里我们即将编写一个右键菜单的指令，我们给某一个元素安装这个指令，右键菜单出现

```html
<template>
  <!-- 右键菜单 -->
  <div
    id="rightMenuDom"
    class="right-menu"
    :style="{
      display: rightMenuStatus,
      top: rightMenuTop,
      left: rightMenuLeft,
    }"
  >
    <ul>
      <li v-for="item in rightMenuList" :key="item.id" v-show="item.id <= 3">
        <!-- status 为 true 时，代表禁用 -->
        <span v-if="item.text?.status === true" class="disable">
          {{ item.text.content }}
        </span>
        <!--status为false时, 参数为对象, 取content中的值-->
        <span v-else-if="item.text?.status === false" @click="item.handler">
          {{ item.text.content }}
        </span>
        <span v-else @click="item.handler">{{ item.text }}</span>
      </li>
      <li>
        <div v-for="item in rightMenuList" :key="item.id" v-show="item.id > 3">
          <!--status为true时, 代表禁用-->
          <span v-if="item?.status === true" class="disable">
            {{ item.text.content }}
          </span>
          <!--status为false时, 参数为对象, 取content中的值-->
          <span v-else-if="item.text?.status === false" @click="item.handler">
            {{ item.text.content }}
          </span>
          <span v-else @click="item.handler">
            {{ item.text }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "RightMenu",
  props: {
    rightMenuStatus: String,
    rightMenuTop: String,
    rightMenuLeft: String,
    rightMenuList: Array,
  },
});
</script>

<style lang="scss" scoped>
// 右键菜单样式
.right-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 166px;
  height: auto;
  background-color: rgb(242, 242, 242);
  border: solid 1px #c2c1c2;
  box-shadow: 0 10px 10px #c2c1c2;
  display: none;
  border-radius: 5px;
  ul {
    padding: 0;
    margin: 0;
    font-size: 15px;
    li {
      list-style: none;
      box-sizing: border-box;
      padding: 6px 0;
      border-bottom: 1px solid rgb(216, 216, 217);
      &:nth-child(1) {
        padding-top: 2px;
      }
      &:nth-last-child(1) {
        border-bottom: none;
      }
      div {
        height: 25px;
        span {
          display: block;
          height: 100%;
          line-height: 25px;
          padding-left: 16px;
          &:hover {
            background-color: #0070f5;
            cursor: pointer;
            color: #ffffff;
          }
        }
        // 禁止点击样式
        .disable {
          color: #666666;
          &:hover {
            cursor: not-allowed;
            background-color: #f2f2f2;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>
```

有了模板之后，

- 我们就需要创建应用 app
- 创建一个元素 div 追加于 body 后面
- 然后使用应用 app 来挂载这个 div 元素

```js
/**
 * 将组件挂在到节点上
 * @param comp 需要挂载的组件
 * @param prop 向组件传的参数
 */

const createComp = function (comp: Component, prop: rightMenuAttribute) {
    // 创建组件
    const app = createApp(comp, {
        ...prop
    })

    // 创建一个元素
    const divEle = document.createElement('div');
    // 将创建的 div 元素挂载追加到 body 里面
    document.body.appendChild(divEle);
    // 将组件挂载到刚才创建的 div 中
    app.mount(divEle);
    // 返回挂载的元素，便于此操作
    return divEle;
}
```

然后我们需要暴露一个 install 方法出去，在 install 方法里面处理右键菜单所有的逻辑，这样 vue 就可以 use 这个插件了

```js
export default {
    install(app: App): void {
        // 监听全局点击，销毁右键菜单 dom
        document.body.addEventListener('click', () => {
            if (menuVM != null) {
                // 销毁右键菜单DOM
                document.body.removeChild(menuVM);
                menuVM = null;
            }
        });
        // 创建指令
        app.directive("rightClick", (el, binding): boolean | void => {
            // 指令绑定元素是否存在判断
            if (el == null) {
                throw "右键指令错误：元素未绑定";
            }
            el.oncontextmenu = function (e: MouseEvent) {
                if (menuVM != null) {
                    // 销毁上次触发的右键菜单DOM
                    document.body.removeChild(menuVM);
                    menuVM = null;
                }
                const textArray = binding.value.text;
                const handlerObj = binding.value.handler;
                // 菜单选项与事件处理函数是否存在
                if (textArray == null || handlerObj == null) {
                    throw "右键菜单内容与事件处理函数为必传项";
                }
                // 事件处理数组
                const handlerArray = [];
                // 处理好的右键菜单
                const menuList = [];
                // 将事件处理函数放入数组中
                for (const key in handlerObj) {
                    handlerArray.push(handlerObj[key]);
                }
                if (textArray.length !== handlerArray.length) {
                    // 文本数量与事件处理不对等
                    throw "右键菜单的每个选项，都必须有它的事件处理函数";
                }
                // 追加右键菜单数据
                for (let i = 0; i < textArray.length; i++) {
                    // 右键菜单对象，添加名称
                    const menuObj: rightMenuObjType = {
                        text: textArray[i],
                        handler: handlerArray[i],
                        id: i + 1
                    }
                    menuList.push(menuObj);
                }
                // 鼠标点的坐标
                const oX = e.clientX;
                const oY = e.clientY;
                // 动态挂载组件，显示右键菜单
                menuVM = createComp(RightMenu, {
                    rightMenuStatus: "block",
                    rightMenuTop: oY + "px",
                    rightMenuLeft: oX + "px",
                    rightMenuList: menuList
                })
                return false;
            }
        })
    }
}
```

pluginType.ts

```js
// 插件内用到的类型进行统一定义
// 右键菜单DOM属性定义

export type rightMenuAttribute = {
    rightMenuStatus: string; // 右键菜单显隐状态
    rightMenuTop: string; // 右键菜单显示位置: 左测距离
    rightMenuLeft: string; // 右键菜单显示位置: 顶部距离
    rightMenuList: Array<rightMenuObjType>; // 右键菜单列表数据: 文本列表、事件处理函数
}

// 右键菜单类型定义
export type rightMenuObjType = {
    id: number,
    text: string | { status: boolean, content: string }, // 文本数组
    handler: Record<string, (...params: any) => void> // 事件处理函数
}

// 右键菜单参数类型定义
export type rightMenuType = {
    this: any, // 当前组件 this 对象
    text: Array<string | { status: boolean, content: string }>, // 文本数组
    handler: Record<string, (...params: any) => void> // 事件处理函数
}


```




