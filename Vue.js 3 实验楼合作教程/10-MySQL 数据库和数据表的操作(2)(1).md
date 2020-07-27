---
show: step
version: 1.0
enable_checker: true
---

# MySQL 数据库和数据表的操作

## 实验介绍

在本节实验中，将会学习如何启动和连接服务器，如何对数据库进行操作，如何创建数据表和在表中添加数据，以及如何检索表中的数据。

#### 知识点

- MySQL 的安装与启动
- MySQL 的连接与断开
- 数据库的操作
- 数据表的操作

#### MySQL 介绍

MySQL 是一个关系型数据库管理系统，由瑞典 MySQLAB 公司开发，目前属于 Oracle 公司。MySQL 是最流行的关系型数据库管理系统，在 Web 应用方面 MySQL 是最好的 RDBMS(Relational Database Management System：关系数据库管理系统)应用软件之一。

由于配置不同，在安装 MySQL 的过程中可能会导致一些问题。所以，就不讲解安装过程了。需要在本地安装的同学，可以在 [在 Windows 下安装](http://dev.mysql.com/downloads/mysql/) 和 [在 Linux 下安装](https://dev.mysql.com/downloads/repo/yum/) 的官方页面自行安装。

## 启动与连接服务器

在实验中使用的 IDE 已经为大家安装好 MySQL，无需自行安装。请同学们打开你们的桌面环境，点击桌面上的 Xfce 终端。

如果觉得终端窗口太小，可以在**视图**中设置全屏模式。在**编辑**中，大家可以根据自己的喜好设置字体大小，背景颜色和代码颜色等。

首先启动服务器，输入命令如下所示。

```sql
sudo service mysql start
```

运行结果如下图所示，说明服务器启动成功。

![1](https://doc.shiyanlou.com/courses/2404/1347963/bc110237a8d78d8bb17cac8acd4d09c1-0/wm)

然后连接服务器，为了连接服务器，当调用 mysql 时，通常需要提供一个 MySQL 用户名并且很可能需要一个密码。在这里我们使用 `root` 用户连接服务器（密码环境设置为空，无需我们输入密码），输入以下命令连接服务器。

```sql
mysql -u root
```

显示如下图，说明服务器启动成功。

![2](https://doc.shiyanlou.com/courses/2404/1347963/cc68bd68dff36e6c898de25730ad6d8d-0/wm)

成功连接服务器后，可以在 `mysql>` 提示下输入 `QUIT` 或 `EXIT` 断开连接。

## 数据库的操作

首先创建数据库，其语法格式为 `CREATE DATABASE <数据库名字>`。

例如，我们创建一个名为 `mysql_test` 的数据库。

```sql
CREATE DATABASE mysql_test;
```

创建后的输出如下，说明创建成功。

![3](https://doc.shiyanlou.com/courses/2404/1347963/40d16cdc4edbf2738aafad7b25564295-0/wm)

用 `SHOW DATABASES` 来查看当前存在的所有数据库。

```sql
SHOW DATABASES;
```

我们能够在数据库表中看到 `mysql_test` 这个数据库的名字。

![4](https://doc.shiyanlou.com/courses/2404/1347963/f5dc78dbfb22343b1fa0e854fe173741-0/wm)

当创建成功后，我们需要让 `USE <数据库名字>` 这个命令执行后，才能够使用该数据库。

```sql
USE mysql_test
```

![5](https://doc.shiyanlou.com/courses/2404/1347963/92a024b90f4e8dd73819f197505c41d9-0/wm)

若你不想要这个数据库了，可以使用 `DROP DATABASE <数据库名字>` 来删除数据库。

例如，删除刚才创建的名为 `mysql_test` 的数据库。

```sql
DROP DATABASE mysql_test;
```

![6](https://doc.shiyanlou.com/courses/2404/1347963/0f48b188cff94f641191bf4b5a555f2b-0/wm)

## 数据表的操作

数据库就像一个衣柜，而衣柜里的小隔间就像空的数据表，在每个小隔间中放入不同类型的衣物，就像我们在数据表中添加数据。接下来我们就学习一下，如何规使用数据表吧。

现在，我们使用 `CREATE TABLE <数据表名>` 在数据库中创建数据表。

创建数据表的语法格式如下所示。

```sql
CREATE TABLE 表的名字（
列名1 数据类型(数据长度),
列名2 数据类型(数据长度),
列名3 数据类型(数据长度)
）;
```

例如，我们创建一个名为 `gradesystem` 的数据库，我们在该数据库中，创建名为 `student` 的数据表，表中包括 学号 ID、学生姓名、性别信息。

```sql
# 创建名为 student 的数据表，包含 id,stu_name,gender

CREATE TABLE student(id int(10),stu_name char(20),gender char(10));
```

显示如下图所示，说明创建成功。

![2-1](https://doc.shiyanlou.com/courses/2404/1347963/f30578a3918be64b9b6944e32b95d1d0-0/wm)

然后再创建一张名为 `mark` 的表，表中包含学生 id 、课程名字和分数，为了让代码看起来更加的整洁美观，您可以分行输入，如下所示。

```sql
# 创建名为 mark 的数据表

CREATE TABLE mark
(
    id int(10), # 学生 id
    name char(20), # 课程名
    grade int(10), # 课程分数
);
```

![2-2](https://doc.shiyanlou.com/courses/2404/1347963/7cf8726cbfb0cb5d4d7fdb0fca32583b-0/wm)

创建数据表后，使用 `SHOW TABLES` 来查看一下，我们能够看到刚才创建的两张数据表的名字。

```sql
SHOW TABLES; # 查询所有数据表
```

![2-3](https://doc.shiyanlou.com/courses/2404/1347963/733cde2c308a920c26a0fcd041374de6-0/wm)

使用 `DESCRIBE <数据表名字>` 来查看创建数据表的完整信息。

例如，我们查看一下数据表 student 的完整信息。

```sql
DESCRIBE student;
```

![2-4](https://doc.shiyanlou.com/courses/2404/1347963/d1d4ad1995a4bf1206faae934eade716-0/wm)

从上图中我们可以看到刚才创建的三个列名，int 和 char 是 MySQL 的两种数据类型，MySQL 的数据类型有很多，不熟悉的同学，可以看一下 [MySQL 的数据类型](https://www.runoob.com/mysql/mysql-data-types.html)。

在图中 Null 全都为 YES，那是因为我们的表中还未添加任何数据，是空表。

到此，我们已经在数据库中建立了两张数据表。接着我们需要在表中添加数据。在表中添加数据，有 `LOAD DATA` 和 `INSERT` 两种方式。

- `LOAD DATA` 是一次可以添加多条数据，可以把文本文件中的数据直接加载到数据表中。
- `INSERT` 是一次增加一条新的数据。

使用 `LOAD DATA` 加载数据，语句格式为：

```sql
LOAD DATA INFILE '加载数据文件的路径' INTO TABLE 表名;
```

使用 `INSERT` 语句向表中插入数据，语句格式为：

```sql
INSERT INTO 表的名字(列名1,列名2,列名3) VALUES(值1,值2,值3);
```

例如，我们用 `INSERT` 语句向 `student` 和 `mark` 表中分别添加数据。

在 `student` 表中插入了四条完整的学生信息数据，如下所示。

```sql
INSERT INTO student(id,stu_name,gender) VALUES(01,'Jack','male');
INSERT INTO student(id,stu_name,gender) VALUES(02,'Candy','male');
INSERT INTO student(id,stu_name,gender) VALUES(01,'Rose','Female');
INSERT INTO student VALUES(04,'Ann','Famale');
```

值得注意的是，当我们插入的数据不完整时，列名对应位置会显示为 NULL。我们尽量不要在表格中留有空值，因为空值会降低查询的性能。我们可以使用数字 0 去代替 NULL，关于空值的处理在后面的实验中会讲解。

插入数据后，我们使用 SELECT 语句来查看表中的完整信息。语法格式为：`SELECT * FROM <数据表名>`。

![2-6](https://doc.shiyanlou.com/courses/2404/1347963/9523436efe22c93edb1c10a129e9ab62-0/wm)

再向 `mark` 表中插入数据，如下所示。

```Mysql
INSERT INTO mark(id,name,grade) VALUES(01,'C++',90);
INSERT INTO mark VALUES(02,'C++',80);
INSERT INTO mark VALUES(03,'JAVA',90);
INSERT INTO mark VALUES(04,'JAVA',50);
```

从代码中我们可以知道，像名字这样 CHAR 类型的数据，我们需要用引号去修饰。除了 CHAR 类型，还有 VARCHAR，TEXT，DATE，TIME，ENUM 等类型的数据也需要用单引号修饰。

![2-7](https://doc.shiyanlou.com/courses/2404/1347963/5cec3d3c1d6f72be78d100281d6835f1-0/wm)

用 SELECT 语句查看一下数据是否成功添加到数据表中。

![2-8](https://doc.shiyanlou.com/courses/2404/1347963/ae3d04298cd1b2b6c698994a5bd7fa96-0/wm)

## 数据表的查询操作

#### 检索特定行的数据

特定行数据检索是查询符合设定条件的一行或者多行数据。

我们使用 `SELECT * FROM <数据表名> WHERE <关键字>` 来查询特定行的数据。

例如，我们查询一下在 `student` 表中，学生姓名为 Ann 的信息。

```sql
SELECT * FROM student WHERE stu_name = 'Ann';
```

![2-9](https://doc.shiyanlou.com/courses/2404/1347963/2d05e94106c7dc4a45faaaed22da92ed-0/wm)

#### 检索特定列的数据

我们也可以仅查看某些列的数据。我们可以使用 `SELECT <列名> FROM <数据表名>`，这里可以写入多个列名，用逗号隔开即可。

例如，我们查询一下在 `student` 表中，所有学生的姓名。

```sql
SELECT stu_name FROM student;
```

![2-10](https://doc.shiyanlou.com/courses/2404/1347963/86dc1de927539d1d73dc844ee3fa0ed1-0/wm)

#### 同时检索特定行和列的数据

我们可以使用 `SELECT <列名> FROM <数据表名> WHERE <关键字>` 来同时进行特定行和列的数据选择。

例如，我们可以查询一下，在 `mark` 表中，学生分数小于 90 分的成绩。

```sql
SELECT grade FROM mark WHERE grade < 90;
```

![2-12](https://doc.shiyanlou.com/courses/2404/1347963/41ac453094c0bbaae176279de7c4b145-0/wm)

#### 排序检索数据

我们可以对数据进行排序检索，例如在检索学生成绩时，我们可以对学生成绩进行排序，这样使得查询结果更加清晰。

使用 `OREDER BY <数据列名>` 可实现对一列或者多列数据进行排序操作。该排序默认是升序，我们可以在其后添加关键字 `DESC` 变成降序。

例如，对 `mark` 表中，学生的成绩进行排序。

```sql
SELECT grade FROM mark ORDER BY grade;
```

![2-13](https://doc.shiyanlou.com/courses/2404/1347963/01a32baa9ff1afb0e453a32c2c38ce97-0/wm)

最后，我们可以把不想要的数据表给删除了。可以使用 `DROP TABLE <表名>` 来删除整个表，包括表中的数据和表的结构。

例如，我们将 `student` 表删除。

![2-5](https://doc.shiyanlou.com/courses/2404/1347963/55f462e74d649afe14a096011568bfa9-0/wm)

## 实验总结

在本节实验中，我们学习了 MySQL 服务器的启动与连接，创建并使用数据库，创建数据表并在表中添加数据，以及查询表中数据的一些 SELECT 语句，包括行检索、列检索、排序检索等操作。
