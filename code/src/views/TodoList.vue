<template>
  <div class="todo-list">
    <div class="header">todoList</div>
    <input type="text" v-model="name" placeholder="请输入名字" />
    &nbsp; &nbsp;
    <input type="text" v-model="sex" placeholder="请输入性别" />
    &nbsp; &nbsp;
    <button @click="add" v-if="indexObj.index === null">添加</button>
    <button @click="update" v-else>更新</button>
    &nbsp; &nbsp;
    <button @click="clear">清空数组</button>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <span>名字为：{{ item.name }}</span>
        &nbsp; &nbsp;
        <span>性别为：{{ item.sex }}</span>
        &nbsp; &nbsp;
        <button @click="edit(index)">编辑</button>
        &nbsp; &nbsp;
        <button @click="del(index)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  name: "todoList",
  setup() {
    let list = ref([]);
    let name = ref("");
    let sex = ref("");
    let indexObj = reactive({ index: null });
    const edit = index => {
      let item = list.value[index];
      name.value = item.name;
      sex.value = item.sex;
      indexObj.index = index;
      console.log(index);
    };
    const del = index => {
      list.value.splice(index, 1);
      indexObj.index = null;
      name.value = "";
      sex.value = "";
    };
    const update = () => {
      if (!name.value || !sex.value) {
        return;
      }
      list.value[indexObj.index].name = name.value;
      list.value[indexObj.index].sex = sex.value;
      sex.value = "";
      name.value = "";
      indexObj.index = null;
    };
    const add = () => {
      if (!name.value || !sex.value) {
        return;
      }
      list.value.push({
        name: name.value,
        sex: sex.value
      });
      name.value = "";
      sex.value = "";
    };
    const clear = () => {
      list.value.length = 0;
    };
    return {
      list,
      name,
      sex,
      indexObj,
      add,
      edit,
      update,
      del,
      clear
    };
  }
};
</script>

<style lang="scss" scoped>
.todo-list {
  width: 600px;
  margin: auto;
  .header {
    height: 30px;
    line-height: 30px;
  }
  ul {
    li {
      // display: flex;
      // justify-content: space-between;
      text-align: left;
      margin-bottom: 10px;
    }
  }
}

li {
  list-style: none;
}
</style>