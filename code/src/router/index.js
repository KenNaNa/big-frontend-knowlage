import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/todoList',
        name: 'todoList',
        component: () =>
            import ('../views/TodoList.vue')
    },
    {
        path: '/parent',
        name: 'parent',
        component: () =>
            import ('../views/Parent.vue')
    },
    {
        path: '/slotName',
        name: 'slotName',
        component: () =>
            import ('../views/SlotName.vue')
    },
    {
        path: '/slotScopes',
        name: 'slotScopes',
        component: () =>
            import ('../views/slotScopes.vue')
    },
    {
        path: '/markRaw',
        name: 'markRaw',
        component: () =>
            import ('../views/markRaw.vue')
    },
    {
        path: '/DynamicArguments',
        name: 'DynamicArguments',
        component: () =>
            import ('../views/DynamicArguments.vue')
    },
    {
        path: '/globalApi',
        name: 'globalApi',
        component: () =>
            import ('../views/globalApi.vue')
    },
    {
        path: '/transition',
        name: 'transition',
        component: () =>
            import ('../views/Transition.vue')
    },
    {
        path: '/tele',
        name: 'tele',
        component: () =>
            import ('../views/tele.vue')
    },
    {
        path: '/async',
        name: 'async',
        component: () =>
            import ('../views/TestSync.vue')
    },
    {
        path: '/prose',
        name: 'prose',
        component: () =>
            import ('../views/Prose.vue')
    },
    {
        path: '/toast',
        name: 'toast',
        component: () =>
            import ('../views/TestToast.vue')
    },
    {
        path: '/route',
        name: 'route',
        component: () =>
            import ('../views/TestRoute.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router