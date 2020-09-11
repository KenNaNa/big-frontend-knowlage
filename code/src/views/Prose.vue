<template>
<Promised :promise="usersPromise">
    <template v-slot:combined="{ isPending, isDelayOver, data, error }">
        <pre>
            pending: {{ isPending }}
            is delay over: {{ isDelayOver }}
            data: {{ data }}
            error: {{ error && error.message }}
        </pre>
    </template>

    <!-- Use the "pending" slot to display a loading message -->
    <template v-slot:pending>
        <p>Loading...</p>
    </template>
    <!-- The default scoped slot will be used as the result -->
    <template v-slot="data">
        <ul>
            <li :key="index" v-for="(user, index) in data">{{ user.name }}</li>
        </ul>
    </template>
    <!-- The "rejected" scoped slot will be used if there is an error -->
    <template v-slot:rejected="error">
        <p>Error: {{ error.message }}</p>
    </template>
</Promised>
</template>

<script>
export default {
    data: () => ({
        usersPromise: null
    }),

    created() {
        this.usersPromise = this.getUsers();
    },

    methods: {
        getUsers() {
            let list = ["Ken", "前端小Ken", "志学Python"];

            return new Promise(resolve => {
                resolve(list);
            });
        }
    }
};
</script>
