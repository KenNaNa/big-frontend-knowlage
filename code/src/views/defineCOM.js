import { defineComponent } from 'vue'
const parent = defineComponent({
    template: `
      <div class="parent">
          <h2>父组件</h2>
          <slot name="child"><slot>
      </div>
    `,
})
const child = defineComponent({
    template: `
          <div class="child">
              <h2>子组件</h2>
          </div>
      `,
})

export {
    parent,
    child
}