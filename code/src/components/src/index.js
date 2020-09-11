import Toast from './Toast.vue'
import { createApp } from 'vue'
const toast = {}
toast.install = (app) => {
    // 扩展 vue 插件
    const ToastCon = createApp(Toast)
    const ktoast = document.createElement('div')
    ktoast.id = 'ktoast'
        // 添加到 body 后面
    document.body.appendChild(ktoast)
    console.log('ktoast', ToastCon)
        // 挂载 dom
    let hh = ToastCon.mount('#ktoast')
    console.log('ktoast', hh)
        // 给 vue 原型添加 toast 方法
    app.config.globalProperties.$toast = (msg, options = { duration: 800, direction: 'top' }) => {
        // 我们调用的时候 赋值 message
        // 将 visible 设置为 true
        // 默认 3s 之后 设置 为 false 关闭 toast
        return new Promise((resolve) => {
            if (options.direction === 'bottom') {
                ktoast.style.top = '95%'
            }
            if (options.direction === 'center') {
                ktoast.style.top = "50%"
            }
            hh.message = msg
            hh.visible = true
            setTimeout(() => {
                hh.visible = false
            }, options.duration)

            resolve(true)
        })
    }
}
export default toast