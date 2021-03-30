```js
function trim (str){
  var reg = /^\s+|\s+$/g;
  str = str.replace(reg,"");
  console.log(str);
};
trim(" abc123   ");
```
