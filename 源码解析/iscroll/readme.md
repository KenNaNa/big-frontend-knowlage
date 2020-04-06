# iscroll.js

```js
(function (window, document, Math) {
//获取兼容性的requestAnimationFrame
var rAF = window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
    // 工具函数库
    var me = {};

    var _elementStyle = document.createElement('div').style;
    var _vendor = (function () {
        var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
            transform,
            i = 0,
            l = vendors.length;

        for ( ; i < l; i++ ) {
            transform = vendors[i] + 'ransform';
            if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
        }

        return false;
    })();

    // 补全后缀命名
    function _prefixStyle (style) {
        if ( _vendor === false ) return false;
        if ( _vendor === '' ) return style;
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }
    // 获取时间戳
    me.getTime = Date.now || function getTime () { return new Date().getTime(); };
    // 复制对象
    me.extend = function (target, obj) {
        for ( var i in obj ) {
            target[i] = obj[i];
        }
    };
    // 绑定事件
    me.addEvent = function (el, type, fn, capture) {
        el.addEventListener(type, fn, !!capture);
    };
    // 移除事件绑定
    me.removeEvent = function (el, type, fn, capture) {
        el.removeEventListener(type, fn, !!capture);
    };

    me.prefixPointerEvent = function (pointerEvent) {
        // 用于IE
        // MSPointerDown 事件  --- > pointerdown 事件
        // 修正IE
        return window.MSPointerEvent ?
            'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8):
            pointerEvent;
    };

    // 动画计算
    me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
        // 当前位置与初始位置的差值
        var distance = current - start,
        // 根据差值求出平均速度
            speed = Math.abs(distance) / time,

            destination,
            duration;
            // 加速度的初始化
        deceleration = deceleration === undefined ? 0.0006 : deceleration;

        // 位移公式
        // x=Vot+1/2at^2 Vt是末速度,Vo是初速度,a是加速度,t为时间,X是位移距离 x=Vot+1/2at^2 Vt=Vo+at V^2-Vo^2=2ax
        destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
        duration = speed / deceleration;

        if ( destination < lowerMargin ) {
            // 从左往右动
            destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        } else if ( destination > 0 ) {
            // 从右往左动
            destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }

        return {
            destination: Math.round(destination),
            duration: duration
        };
    };

    // 补全tranform后缀
    var _transform = _prefixStyle('transform');

    // 扩展一些属性
    // hasTransform 判断有没有transform属性
    // hasPerspective 判断有没有perspective属性
    // hasTouch 判断有没有ontouchstart事件
    // hasPointer 判断有没有指针事件
    // hasTransition 判断有没 transition;
    me.extend(me, {
        hasTransform: _transform !== false,
        hasPerspective: _prefixStyle('perspective') in _elementStyle,
        hasTouch: 'ontouchstart' in window,
        hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
        hasTransition: _prefixStyle('transition') in _elementStyle
    });

    /*
    This should find all Android browsers lower than build 535.19 (both stock browser and webview)
    - galaxy S2 is ok
    - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
    - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S3 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S4 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S5 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
   - galaxy S6 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
  */
    // 判断过期的Adroid内核版本
    // 
    me.isBadAndroid = (function() {
        var appVersion = window.navigator.appVersion;
        // Android browser is not a chrome browser.
        // // 判断为安卓浏览器，而不是谷歌浏览器
        if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
            var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
            if(safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                return parseFloat(safariVersion[1]) < 535.19;
            } else {
                return true;
            }
        } else {
            return false;
        }
    })();

    // 扩展样式
    // transform 补全样式
    // transitionTimingFunction 补全transition-timeing-function 属性
    // transitionDuration 补全transition-duration 属性
    // transitionDelay 补全 transition-delay 属性
    // transformOrigin 补全 transition-origin 属性
    // touchAction 补全touch-action 属性
    me.extend(me.style = {}, {
        transform: _transform,
        transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
        transitionDuration: _prefixStyle('transitionDuration'),
        transitionDelay: _prefixStyle('transitionDelay'),
        transformOrigin: _prefixStyle('transformOrigin'),
        touchAction: _prefixStyle('touchAction')
    });

    // 判断元素是否V有某个class类名
    me.hasClass = function (e, c) {
        // " op"
        // "op"
        // " op "
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(e.className);
    };

    // 给元素添加某个class 类名
    me.addClass = function (e, c) {
        // 判断是否有某个类名
        // 有，就什么都不做
        if ( me.hasClass(e, c) ) {
            return;
        }
        // 按空格分割
        var newclass = e.className.split(' ');
        newclass.push(c);
        e.className = newclass.join(' ');
    };

    // 移除某些样式class类名
    me.removeClass = function (e, c) {
        if ( !me.hasClass(e, c) ) {
            return;
        }

        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
        e.className = e.className.replace(re, ' ');
    };

    // 获取定位值
    me.offset = function (el) {
        var left = -el.offsetLeft,
            top = -el.offsetTop;

        // jshint -W084
        while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
        }
        // jshint +W084

        return {
            left: left,
            top: top
        };
    };
    // 扩展除默认事件之外的
    me.preventDefaultException = function (el, exceptions) {
        for ( var i in exceptions ) {
            if ( exceptions[i].test(el[i]) ) {
                return true;
            }
        }

        return false;
    };

    // 扩展事件类型
    me.extend(me.eventType = {}, {
        // 手机版本
        touchstart: 1,
        touchmove: 1,
        touchend: 1,
        // pc版本
        mousedown: 2,
        mousemove: 2,
        mouseup: 2,

        pointerdown: 3,
        pointermove: 3,
        pointerup: 3,

        MSPointerDown: 3,
        MSPointerMove: 3,
        MSPointerUp: 3
    });

    // 缓动函数
    me.extend(me.ease = {}, {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function (k) {
                return k * ( 2 - k );
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',   // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function (k) {
                var b = 4;
                return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
            }
        },
        bounce: {
            style: '',
            fn: function (k) {
                if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
                    return 7.5625 * k * k;
                } else if ( k < ( 2 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                } else if ( k < ( 2.5 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                } else {
                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                }
            }
        },
        elastic: {
            style: '',
            fn: function (k) {
                var f = 0.22,
                    e = 0.4;

                if ( k === 0 ) { return 0; }
                if ( k == 1 ) { return 1; }

                return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
            }
        }
    });

    // 手机端的点击事件
    me.tap = function (e, eventName) {
        var ev = document.createEvent('Event');
        ev.initEvent(eventName, true, true);
        ev.pageX = e.pageX;
        ev.pageY = e.pageY;
        e.target.dispatchEvent(ev);
    };

    // 扩展pc端click事件
    me.click = function (e) {
        var target = e.target,
            ev;
            // 除去select  input textarea 不需要点击事件
        if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
            // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
            // initMouseEvent is deprecated.
            ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
            ev.initEvent('click', true, true);
            ev.view = e.view || window;
            ev.detail = 1;
            ev.screenX = target.screenX || 0;
            ev.screenY = target.screenY || 0;
            ev.clientX = target.clientX || 0;
            ev.clientY = target.clientY || 0;
            ev.ctrlKey = !!e.ctrlKey;
            ev.altKey = !!e.altKey;
            ev.shiftKey = !!e.shiftKey;
            ev.metaKey = !!e.metaKey;
            ev.button = 0;
            ev.relatedTarget = null;
            ev._constructed = true;
            target.dispatchEvent(ev);
        }
    };

    // 扩展手机端触摸动作
    // 获取触摸动作
    me.getTouchAction = function(eventPassthrough, addPinch) {
        var touchAction = 'none';
        // 判断手指滑动方向
        if ( eventPassthrough === 'vertical' ) {
            touchAction = 'pan-y';
        } else if (eventPassthrough === 'horizontal' ) {
            touchAction = 'pan-x';
        }
        if (addPinch && touchAction != 'none') {
            // add pinch-zoom support if the browser supports it, but if not (eg. Chrome <55) do nothing
            touchAction += ' pinch-zoom';
        }
        return touchAction;
    };

    // 获取元素的定位
    // 获取元素的宽高
    // 分两种
    // 一种是 SVG
    // 一种是 一般元素
    me.getRect = function(el) {
        if (el instanceof SVGElement) {
            var rect = el.getBoundingClientRect();
            return {
                top : rect.top,
                left : rect.left,
                width : rect.width,
                height : rect.height
            };
        } else {
            return {
                top : el.offsetTop,
                left : el.offsetLeft,
                width : el.offsetWidth,
                height : el.offsetHeight
            };
        }
    };

    return me;
})();

// 构造函数IScroll
function IScroll (el, options) {
    // 获取元素
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    // 保存滚动元素
    this.scroller = this.wrapper.children[0];
    // 保存滚动元素样式
    this.scrollerStyle = this.scroller.style;       // cache style for better performance

    this.options = {
        // resize 滚动条
        resizeScrollbars: true,

        // 鼠标滚动速度
        mouseWheelSpeed: 20,

        // 触摸时间
        snapThreshold: 0.334,

// INSERT POINT: OPTIONS
        // 禁止鼠标事件
        // 触摸事件
        // 指针事件
        disablePointer : !utils.hasPointer,
        // 在手机上
        disableTouch : utils.hasPointer || !utils.hasTouch,
        // 在PC端
        disableMouse : utils.hasPointer || utils.hasTouch,
        // 初始化为最上边，最左边
        startX: 0,
        startY: 0,
        // 默认y可以滚动
        scrollY: true,
        // 方向锁定时间
        directionLockThreshold: 5,
        // 计算距离
        momentum: true,

        // 回弹
        bounce: true,
        // 回弹时间
        bounceTime: 600,
        // 缓动函数
        bounceEasing: '',
        // 默认开启阻止默认事件
        preventDefault: true,
        // 不阻止默认事件
        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

        HWCompositing: true,
        // 默认使用transition，transform
        useTransition: true,
        useTransform: true,
        // 把事件mousedown绑定在
        // wrapper上
        bindToWrapper: typeof window.onmousedown === "undefined"
    };

    for ( var i in options ) {
        // 扩展传进来的参数配置
        this.options[i] = options[i];
    }

    // 
    //  options
    //  保存translateZ的样式
    this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
    // 重新计算transition,transform属性是否存在
    this.options.useTransition = utils.hasTransition && this.options.useTransition;
    this.options.useTransform = utils.hasTransform && this.options.useTransform;

    // 重新计算方向
    // 传入true - > 'vertical'
    // 重新计算是否开启阻止默认事件
    // 如果方向为‘vertical’，就阻止默认事件触发
    // 否则不用
    this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    // 锁定某个方向
    this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
    this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
    // 锁定方向的时间
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

    // 设置缓动函数
    this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

    // 窗口改变大小
    // 重新计算
    this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

    if ( this.options.tap === true ) {
        // 设置tap事件
        this.options.tap = 'tap';
    }

    // https://github.com/cubiq/iscroll/issues/1029
    if (!this.options.useTransition && !this.options.useTransform) {
        // 判断定位
        if(!(/relative|absolute/i).test(this.scrollerStyle.position)) {
            this.scrollerStyle.position = "relative";
        }
    }

    if ( this.options.shrinkScrollbars == 'scale' ) {
        // 如果是伸缩的话
        // 就不使用transition 属性
        this.options.useTransition = false;
    }

    // 授予鼠标滚动方向
    this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

// INSERT POINT: NORMALIZATION

    // Some defaults
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this._events = {};

// INSERT POINT: DEFAULTS

    this._init();
    this.refresh();

    this.scrollTo(this.options.startX, this.options.startY);
    this.enable();
}

IScroll.prototype = {
    version: '5.2.0-snapshot',

    _init: function () {
        this._initEvents();

        if ( this.options.scrollbars || this.options.indicators ) {
            // 滚动条，和那个指示器，
            this._initIndicators();
        }

        if ( this.options.mouseWheel ) {
            // 初始化滚轮事件
            this._initWheel();
        }

        if ( this.options.snap ) {
            // 
            this._initSnap();
        }

        if ( this.options.keyBindings ) {
            // 键盘事件绑定
            this._initKeys();
        }

// INSERT POINT: _init

    },
    // 销毁滚动事件
    destroy: function () {
        this._initEvents(true);
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = null;
        this._execEvent('destroy');
    },

    _transitionEnd: function (e) {
        // 动画过渡结束之后
        // 
        if ( e.target != this.scroller || !this.isInTransition ) {
            return;
        }

        this._transitionTime();
        if ( !this.resetPosition(this.options.bounceTime) ) {
            this.isInTransition = false;
            // 执行滚动结束事件
            this._execEvent('scrollEnd');
        }
    },

    _start: function (e) {
        // 相当于onmousedown
        // ontouchstart
        // React to left mouse button only
        // 获取只按下左键
        if ( utils.eventType[e.type] != 1 ) {
          // for button property
          // http://unixpapa.com/js/mouse.html
          var button;
        if (!e.which) {
          /* IE case */
          // 兼容IE
          button = (e.button < 2) ? 0 :
                   ((e.button == 4) ? 1 : 2);
        } else {
          /* All others */
          button = e.button;
        }
            if ( button !== 0 ) {
                return;
            }
        }

        if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
            return;
        }

        if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
            // 阻止默认事件
            e.preventDefault();
        }
        // 获取触摸点
        var point = e.touches ? e.touches[0] : e,
            pos;
        // 初始化事件类型
        this.initiated  = utils.eventType[e.type];
        // 这个时候没有move事件
        // 只有左键按下这一个操作
        this.moved      = false;
        // 初始化位置
        this.distX      = 0;
        this.distY      = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.directionLocked = 0;
        // 左键按钮按下的初始时间
        this.startTime = utils.getTime();

        // 动画结束时
        // 如果当我们鼠标左键按下之前有动画执行时
        // 把动画结束掉
        // 还原到原来的位置
        if ( this.options.useTransition && this.isInTransition ) {
            this._transitionTime();
            this.isInTransition = false;
            pos = this.getComputedPosition();
            this._translate(Math.round(pos.x), Math.round(pos.y));
            this._execEvent('scrollEnd');
        } else if ( !this.options.useTransition && this.isAnimating ) {
            this.isAnimating = false;
            this._execEvent('scrollEnd');
        }

        // 保存初始位置
        this.startX    = this.x;
        this.startY    = this.y;
        this.absStartX = this.x;
        this.absStartY = this.y;
        this.pointX    = point.pageX;
        this.pointY    = point.pageY;

        this._execEvent('beforeScrollStart');
    },

    _move: function (e) {
        // 移动事件
        // onmousemove
        // ontouchmove
        if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
            return;
        }

        if ( this.options.preventDefault ) {    // increases performance on Android? TODO: check!
            e.preventDefault();
        }
        // 获取滑动时的点
        var point       = e.touches ? e.touches[0] : e,
        // 求出滑动差
            deltaX      = point.pageX - this.pointX,
            deltaY      = point.pageY - this.pointY,
            // 获取滑动当前时间戳
            timestamp   = utils.getTime(),
            newX, newY,
            absDistX, absDistY;
        // 保存当前
        // pageX
        // pageY
        this.pointX     = point.pageX;
        this.pointY     = point.pageY;

        // 滑动的距离
        this.distX      += deltaX;
        this.distY      += deltaY;
        absDistX        = Math.abs(this.distX);
        absDistY        = Math.abs(this.distY);

        // We need to move at least 10 pixels for the scrolling to initiate
        // 时间间隔300ms 和 位置小于10
        // 什么都不做
        if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
            return;
        }

        // If you are scrolling in one direction lock the other
        // 锁定方向判断
        if ( !this.directionLocked && !this.options.freeScroll ) {
            // directionLockThreshold方向误差
            if ( absDistX > absDistY + this.options.directionLockThreshold ) {
                this.directionLocked = 'h';     // lock horizontally
            } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
                this.directionLocked = 'v';     // lock vertically
            } else {
                this.directionLocked = 'n';     // no lock
            }
        }

        if ( this.directionLocked == 'h' ) {
            if ( this.options.eventPassthrough == 'vertical' ) {
                // 阻止默认事件触发
                e.preventDefault();
            } else if ( this.options.eventPassthrough == 'horizontal' ) {
                this.initiated = false;
                return;
            }
            // 
            deltaY = 0;
        } else if ( this.directionLocked == 'v' ) {
            if ( this.options.eventPassthrough == 'horizontal' ) {
                e.preventDefault();
            } else if ( this.options.eventPassthrough == 'vertical' ) {
                this.initiated = false;
                return;
            }

            deltaX = 0;
        }

        deltaX = this.hasHorizontalScroll ? deltaX : 0;
        deltaY = this.hasVerticalScroll ? deltaY : 0;
        // 计算出新的位置
        newX = this.x + deltaX;
        newY = this.y + deltaY;

        // Slow down if outside of the boundaries
        // 滑出边界的话
        if ( newX > 0 || newX < this.maxScrollX ) {
            // 左边界=>0
            // 右边界=>this.maxScrollX
            // 中间 this.x + deltaX / 3
            // this.options.bounce 是否还在缓动中
            newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;

        }
        if ( newY > 0 || newY < this.maxScrollY ) {
            // 上边界=>0
            // 下边界=>this.maxScrollY
            // 中间 this.y + deltaY / 3
            // this.options.bounce 是否还在缓动中
            newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
        }
        // 判断是往上滑动
        // 还是往下滑动
        this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if ( !this.moved ) {
            // 开始滚动
            this._execEvent('scrollStart');
        }
        // 滚动之后设置为true
        // 保证触发一次
        this.moved = true;

        // translate到newX,newY
        this._translate(newX, newY);

/* REPLACE START: _move */

        if ( timestamp - this.startTime > 300 ) {
            // 保存当前时间戳
            // 当前位置
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;
        }

/* REPLACE END: _move */

    },
    // 滚动结束
    _end: function (e) {
        if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
            return;
        }

        if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
            e.preventDefault();
        }

        var point = e.changedTouches ? e.changedTouches[0] : e,
            momentumX,
            momentumY,
            // 滑动的总时间
            duration = utils.getTime() - this.startTime,
            // 获取滑动结束时的位置
            newX = Math.round(this.x),
            newY = Math.round(this.y),
            // 计算出滚动的距离
            distanceX = Math.abs(newX - this.startX),
            distanceY = Math.abs(newY - this.startY),
            time = 0,
            easing = '';

        this.isInTransition = 0;
        this.initiated = 0;
        this.endTime = utils.getTime();

        // reset if we are outside of the boundaries
        // 画出边界
        // 重新计算
        if ( this.resetPosition(this.options.bounceTime) ) {
            return;
        }

        this.scrollTo(newX, newY);  // ensures that the last position is rounded

        // we scrolled less than 10 pixels
        if ( !this.moved ) {
            if ( this.options.tap ) {
                // 移动端
                // 添加点击事件
                utils.tap(e, this.options.tap);
            }

            if ( this.options.click ) {
                // pc端
                utils.click(e);
            }
            // 取消滚动
            this._execEvent('scrollCancel');
            return;
        }

        if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
            this._execEvent('flick');
            return;
        }

        // start momentum animation if needed
        if ( this.options.momentum && duration < 300 ) {
            momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
            momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
            newX = momentumX.destination;
            newY = momentumY.destination;
            time = Math.max(momentumX.duration, momentumY.duration);
            this.isInTransition = 1;
        }


        if ( this.options.snap ) {
            var snap = this._nearestSnap(newX, newY);
            this.currentPage = snap;
            time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
            newX = snap.x;
            newY = snap.y;

            this.directionX = 0;
            this.directionY = 0;
            easing = this.options.bounceEasing;
        }

// INSERT POINT: _end

        if ( newX != this.x || newY != this.y ) {
            // 超出边界
            // change easing function when scroller goes out of the boundaries
            if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
                easing = utils.ease.quadratic;
            }
            //滚动到新位置
            this.scrollTo(newX, newY, time, easing);
            return;
        }
        //执行滚动结束函数
        this._execEvent('scrollEnd');
    },
```