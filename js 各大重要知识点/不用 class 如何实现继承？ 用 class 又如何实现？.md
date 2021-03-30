# 不用 class 如何实现继承？

```js
// 1. 通过原型进行集成
// 2. 在子类构造函数中调用父类的构造函数


// 父类
function Student(name, age) {
  this.name = name
  this.age = age
}

// 给父类添加一个实例方法
Student.prototype.study = function() {
  console.log("学习")
}

// 子类
function collegeStu(name, age, school) {
  Student.call(this, name, age) // 若不指定 this，直接调用父类的构造函数，this 会指向 window
  this.school = school
}

let student1 = new Student("小仙女", 18)

collegeStu.prototype = new Student()
collegeStu.prototype.constructor = collegeStu
let collegeStu1 = new collegeStu("Ken", 20, "电子科技大学中山学院")
collegeStu1.study()
```

# class类实现原型继承

```js
class Student{
   constructor(name,age){
        this.name = name
        this.age = age
    }
      study(){
        console.log('学习')
      }
  }

  class collegeStu extends Student{
    constructor(name,age,school){
        super(name,age)
        this.school = school
    }
  }
  
  let student1 = new Student('小明',10)
  student1.study() // 学习

  let collegeStu1 = new collegeStu('小华',20,'xxx大学')
  collegeStu1.study() // 继承父类的方法 学习
```
