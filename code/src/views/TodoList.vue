<template>
  <div class="todo-list">
    <div class="header">todo lists</div>
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
        <div class="btndiv">
          <button class="btn" @click="edit(index)">编辑</button>
          &nbsp; &nbsp;
          <button class="btn" @click="del(index)">删除</button>
        </div>
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
    height: 60px;
    line-height: 60px;
    background-color: #3e3e3e;
    color: #dddddd;
    font-size: 48px;
    margin-bottom: 20px;
  }
  button {
    display: contents;
    cursor: pointer;
  }
  ul {
    padding: 0;
    li {
      text-align: left;
      height: 30px;
      margin-bottom: 10px;
      background-color: #ffffff;
      line-height: 30px;
      border-left: 5px solid #629a9c;
      border-radius: 5px;
      padding-left: 30px;
      padding-right: 30px;
      color: #ffdfa5;
      .btndiv {
        float: right;
      }
      .btn {
        margin-right: 20px;
        display: contents;
        cursor: pointer;
        text-align: right;
      }
    }
  }
}

li {
  list-style: none;
}
</style>