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
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router