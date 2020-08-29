"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var drag = {
  beforeMount: function beforeMount(el) {
    el.onmousedown = function (e) {
      //获取鼠标点击出分别与div左边和上边的距离：鼠标位置-div位置
      var disX = e.clientX - el.offsetLeft;
      var disY = e.clientY - el.offsetTop; //onmousemove一定要在onmousedown里面，表示点击后才能移动，为防止鼠标移出div，使用document.onmousemove.

      document.onmousemove = function (e) {
        //获取移动后div的位置：鼠标的位置-disX/disY
        var l = e.clientX - disX;
        var t = e.clientY - disY;
        el.style.left = l + 'px';
        el.style.top = t + 'px';
      }; //停止移动


      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
  mounted: function mounted() {},
  beforeUpdate: function beforeUpdate() {},
  updated: function updated() {},
  beforeUnmount: function beforeUnmount() {},
  // new
  unmounted: function unmounted() {}
};
var _default = drag;
exports["default"] = _default;