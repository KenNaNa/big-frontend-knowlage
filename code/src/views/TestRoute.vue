<template>
<div ref="root">
    <button @click="click">click</button>
    <button @click="toHome">toHemo</button>
    <button @click="toAbout">toAbout</button>
</div>
</template>

<script>
import {
    getCurrentInstance,
    ref
} from "vue";
import {
    createRouter,
    createWebHistory
} from "vue-router";
import OtherRoute from './OtherRoute.vue'
export default {
    name: "TestRoute",
    props: {
        test: {
            type: String,
            default: "test"
        }
    },
    data() {
        return {
            msg: "haha"
        };
    },
    setup() {
        let root = ref(null);
        let routes = [{
            path: "/",
            name: "Home",
            component: import( /* webpackChunkName: "about" */ './Home.vue')
        }, {
            path: '/about',
            name: 'About',
            component: import( /* webpackChunkName: "about" */ './About.vue')
        }];
        let router = createRouter({
            history: createWebHistory(process.env.BASE_URL),
            routes
        })
        router.addRoute({
            path: '/otherroute',
            name: 'OtherRoute',
            component: OtherRoute
        })
        let isHasRoute = router.hasRoute('OtherRoute')
        let route = router.getRoutes()
        router.removeRoute('OtherRoute')
        let isRemove = router.hasRoute('OtherRoute')
        route = router.getRoutes()
        let {
            ctx
        } = getCurrentInstance();
        let click = () => {
            console.log(ctx);
            console.log(ctx.$attrs);
            console.log(ctx.$data);
            console.log(ctx.$props);
            console.log(ctx.$el);
            console.log(ctx.$options);
            console.log(ctx.$refs);
            console.log(ctx.$root);
            console.log(ctx.$router);
            console.log(ctx.$slots);
            console.log(ctx.$store);
            console.log(ctx.$toast);
            console.log(ctx.$watch);
            console.log('router===>', router)
            console.log('router===>', isHasRoute)
            console.log('router===>', route)
            console.log("remove route===>", isRemove)
            console.log('router===>', route)
        };
        let toHome = () => {};
        let toAbout = () => {};
        return {
            click,
            toHome,
            toAbout,
            root
        };
    }
};
</script>
