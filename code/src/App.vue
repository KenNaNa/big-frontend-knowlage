<template>
<div id="app">
    <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <!--<router-link to="/todoList">todoList</router-link>
        <router-link to="/parent">slots</router-link>
        <router-link to="/slotName">slotName</router-link>
        <router-link to="/slotScopes">slotScopes</router-link>
        <router-link to="/markRaw">markRaw</router-link>
        <router-link to="/draggable">draggable</router-link>
        <router-link to="/kDragTest">kDragTest</router-link>
        <router-link to="/DynamicArguments">DynamicArguments</router-link>
        <router-link to="/globalApi">globalApi</router-link>
        <router-link to="/transition">transition</router-link>
        <router-link to="/tele">tele</router-link>
        <router-link to="/async">async</router-link>
        <router-link to="/prose">prose</router-link>
        <router-link to="/toast">toast</router-link>-->
        <router-link to="/route">route</router-link>
    </div>
    <router-view />
</div>
</template>

<style lang="scss">
html,
body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}

#app {
    width: 100%;
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: auto;
    background-color: #cdcdcd;
}

#nav {
    padding: 30px;

    a {
        display: inline-block;
        padding: 10px 20px;
        font-weight: bold;
        color: #fff;
        background-color: #21c573;
        margin-right: 10px;

        &.router-link-exact-active {
            color: #fff;
        }
    }
}
</style>
