"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _Home = _interopRequireDefault(require("../views/Home.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var routes = [{
  path: '/',
  name: 'Home',
  component: _Home["default"]
}, {
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/About.vue'));
    });
  }
}, {
  path: '/todoList',
  name: 'todoList',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/TodoList.vue'));
    });
  }
}, {
  path: '/parent',
  name: 'parent',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/Parent.vue'));
    });
  }
}, {
  path: '/slotName',
  name: 'slotName',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/SlotName.vue'));
    });
  }
}, {
  path: '/slotScopes',
  name: 'slotScopes',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/slotScopes.vue'));
    });
  }
}, {
  path: '/markRaw',
  name: 'markRaw',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/markRaw.vue'));
    });
  }
}, {
  path: '/DynamicArguments',
  name: 'DynamicArguments',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/DynamicArguments.vue'));
    });
  }
}, {
  path: '/globalApi',
  name: 'globalApi',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/globalApi.vue'));
    });
  }
}, {
  path: '/transition',
  name: 'transition',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/Transition.vue'));
    });
  }
}, {
  path: '/tele',
  name: 'tele',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/tele.vue'));
    });
  }
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHistory)(process.env.BASE_URL),
  routes: routes
});
var _default = router;
exports["default"] = _default;