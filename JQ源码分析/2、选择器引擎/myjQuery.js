(function (root) {
    var jQuery = function (selector,context) {
        // 已知通过调用$() 或者 jquery() 就可以获得jquery实例对象
        // 内部就是直接返回一个实例对象 这个实例对象的原型对象是jquery的实例对象
        // 那么这个原形对象就共享jq原型对象上的所有方法了
        return new jQuery.prototype.init(selector,context);
    }
    var rootjQuery;
    jQuery.fn = jQuery.prototype = {
        // 因为我们重新设置了一个对象 所以需要把constructor指向回构造函数 方便日后使用
        constructor : jQuery,
        // 入口 选择器引擎
        init: function (selector,context,root) {
            if(!selector)return this;
            root = root || rootjQuery;
            // 传入的是字符串 里面判断是HTML代码还是选择器表达式
            if(typeof selector === "string"){
                // 传入的是html代码  创建DOM元素
                var quickExpr = /^(?:[^ # <]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
                
                if(selector.charAt(0) === "<" && selector.charAt(selector.length-1) === ">" && selector.length >= 3){
                    // 创建DOM对象 Element对象  <...>假设这样的是HTML片段 
                    /*
                        exec:
                            第一个参数是与正则表达式相匹配的文本
                            第二个参数是与第一个子表达式相匹配的文本 也就是第一个分组() 没有子表达式则undefined
                    var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
                    result = rsingleTag.exec(selector);
                    selector = document.createElement(result[1]);
                    this[0] = selector;
                    this.length = 1;
                    return this
                    */
                    match = [ null, selector, null ];
                    // console.log(match);
                }else {
                    // 其他类型 比如选择器表达式
                    // console.log(selector);
                    match = quickExpr.exec( selector );
                    // console.log(match);
                }
                if(match){
                    if(match[1]){
                        ret = rsingleTag.exec(match[1]);
                        elem = document.createElement(ret[1]);
                        this[0] = elem;
                        this.length = 1;
                        return this
                    }else if(match[2]){
                        elem = document.getElementById(match[2]);
                        this[0] = elem;
                        this.length = 0;
                        return this
                    }
                }
            }else if(selector.nodeType){//Elment对象
                this.context = this[0] = selector;
			    this.length = 1;
                return this
            }else if(jQuery.isPlainObject(selector)){//对象
                this[0] = selector;
                this.length = 1;
                return this
            }
        },
        css(){
            this[0].style.width = "100px";
            return this
        },
        appendTo(context){
            console.log(this[0],context);
            document[context].appendChild(this[0]);
            return this
        }
    }
    rootjQuery = jQuery(document);
    // 这是构造函数的方法  函数也是对象 也可以有属性 和方法
    jQuery.add = () => {
        return 1 + 2;
    };

    //如果这个工具函数 是jQuery本身和jQuery实例都可以用的话 那么就通过以下的方法定义
    jQuery.extend = jQuery.fn.extend = function () {
        // 第一个参数可选boolean true就是深拷贝 ||  被扩展对象
        // 第二个参数扩展对象 如果没有传 那么前面的对象就是给jq本身扩展的扩展对象
        // 后面的参数如果是对象 那么也是扩展对象
        var target, option, name, length, i, deep;
        // 假设第一个参数是被扩展对象 如果有值就传入给target 被扩展对象变量 没值或者是无效值(在判断的时候隐士转换为了false)的则直接返回{}
        target = arguments[0] || {};
        deep = false;
        i = 1;//相当有指向扩展对象的索引
        length = arguments.length;



        // 如果第一个参数是布尔值 则是深拷贝
        if (typeof target == "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 如果被扩展对象不是一个对象或者函数(函数也是对象 也可以有属性和方法) 那么就设置一个空对象
        if (typeof target !== "object" && typeof target !== "function") {
            target = {};
        }
        // 如果只传入一个参数 则是扩展jq或jq实例本身
        if (i == length) {
            target = this;
            i--;//那么扩展对象的索引就是0
        }
        // 遍历扩展对象
        for (; i < length; i++) {
            option = arguments[i];//扩展对象
            for (name in arguments[i]) {
                src = target[name];//[1,2]   0=>1
                copy = option[name];//{0:2,1:2,2:3} 0=>2
                // console.log(src,copy)
                if (deep && copy && jQuery.isPlainObject(copy)) {//这是深拷贝的入口 也是深拷贝的出口 当递归到扩展对象的属性值的值(没错就是属性值的值)为空的时候
                    if (toString.call(copy) == "[object Array]") {
                        // 如果原属性不是数组 就设置一个空数组对象
                        src = jQuery.isArray(src) ? src : [];
                    } else {
                        src = toString.call(src) == "[object Object]" ? src : {};
                    }
                    // console.log(src,copy)
                    target[name] = this.extend(deep, src, copy);
                } else {
                    target[name] = option[name];
                }
            }
        }
        return target
    }
    jQuery.extend({
        // 添加类型检测方法
        isPlainObject: function (obj) {
            return typeof obj == "object"
        },
        isArray: function (obj) {
            return toString.call(obj) == "[object Array]";
        },
        // 类数组转真数组 同时还衍生出合并数组的方法 柯里化   类数组一定有length属性
        markArray: function (arr) {
            // 通过创建一个真数组 然后把伪数组的成员遍历到真数组中
            var result = [];
            // 把arr类数组转真数组
            if (arr && arr.length) {
                return jQuery.merge(result, arr);
            }
        },
        // 合并数组
        merge: function (arr1, arr2) {
            if (jQuery.isPlainObject(arr1) && jQuery.isPlainObject(arr2)) {
                if (typeof arr2.length == "number") {
                    for (var i = 0; i < arr2.length; i++) {
                        arr1[i] = arr2[i];
                    }
                } else {
                    var i = 0;
                    while (arr2[i]) {
                        arr1[i] = arr2[i];
                        i++;
                    };
                };
                return arr1
            }
        }
    })

    jQuery.prototype.init.prototype = jQuery.prototype;
    root.jQuery = root.$ = jQuery;//让全局对象的$和jQuery属性 等于jQuery构造函数 既可以直接使用jQuery构造函数的方法 又可以创建一个jQuery的实例对象 使用原型上的方法
})(window)
