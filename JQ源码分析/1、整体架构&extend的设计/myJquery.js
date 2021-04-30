(function (root) {
    let jQuery = function () {
        // 已知通过调用$() 或者 jquery() 就可以获得jquery实例对象
        // 内部就是直接返回一个实例对象 这个实例对象的原型对象是jquery的实例对象
        // 那么这个原形对象就共享jq原型对象上的所有方法了
        return new jQuery.prototype.init();
    }
    jQuery.fn = jQuery.prototype = {
        init: function () {

        }
    }
    // 这是构造函数的方法  函数也是对象 也可以有属性 和方法
    jQuery.add = () => {
        return 1 + 2;
    }

    jQuery.extend = jQuery.fn.extend = function(){
        // 第一个参数可选boolean true就是深拷贝 ||  被扩展对象 
        // 第二个参数扩展对象 如果没有传 那么前面的对象就是给jq本身扩展的扩展对象
        // 后面的参数如果是对象 那么也是扩展对象
        var target,option,name,length,i,deep;
        // 假设第一个参数是被扩展对象 如果有值就传入给target 被扩展对象变量 没值或者是无效值(在判断的时候隐士转换为了false)的则直接返回{}
        target = arguments[0] || {};
        deep = false;
        i = 1;//相当有指向扩展对象的索引
        length = arguments.length;



        // 如果第一个参数是布尔值 则是深拷贝 
        if(typeof target == "boolean"){
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 如果被扩展对象不是一个对象或者函数(函数也是对象 也可以有属性和方法) 那么就设置一个空对象
        if(typeof target !== "object" && typeof target !== "function"){
            target = {};
        }
        // 如果只传入一个参数 则是扩展jq或jq实例本身
        if(i==length){
            target = this;
            i--;//那么扩展对象的索引就是0
        }
        // 遍历扩展对象
        for(; i<length;i++){
            option = arguments[i];//扩展对象
            for (name in arguments[i]) {
                src = target[name];
                copy = option[name];
                // console.log(src,copy)
                if(deep && copy && typeof copy == "object"){//这是深拷贝的入口 也是深拷贝的出口 当递归到扩展对象的属性值的值(没错就是属性值的值)为空的时候
                   if(toString.call(copy) == "[object Array]"){
                        // 如果原属性不是数组 就设置一个空数组对象
                        src = toString.call(src) == "[object Array]" ? src : [];
                    }else{
                        src = toString.call(src) == "[object Object]" ? src : {};
                    }
                    // console.log(src,copy)
                    target[name] = this.extend(deep,src,copy)
                }else{
                    target[name] = option[name];
                } 
            }
        }
        return target

    }
    jQuery.extend({
        // 添加类型检测方法
        isPlainObject : function(obj){
            return typeof obj == "object"
        },
        isArray : function(obj){
            return toString.call(obj) == "[object Array]";
        }
    })
    /* 
        extend的实现:
            extend(deep(boolean可选 深拷贝还是浅拷贝),origin,target) 用一个或多个其他对象来扩展一个对象，返回被扩展的对象。
            1、任意对象扩展
                $.extend(origin,target)
            2、jQuery自身扩展
                $.extend(target)
            3、jQuery实例对象扩展
                $.fn.extend(target)
                这就是为什么原型对象还要赋值给jQuery.fn
                在2和3之间只需要通过this就可以判断是哪个用法

            深拷贝、浅拷贝:
                浅拷贝:
                    普通类型值直接赋值 引用数据类型值 直接引用地址 如果原对象的该属性是对象 那么就被直接替换了新地址
                深拷贝:
                    普通值直接赋值 引用数据类型 如果原属性不是引用数据类型 那么就根据被拷贝的属性的数据类型创建一个对象 然后赋值过去 这样就不是引用同一个地址了
                    如果原属性是一个引用数据类型 那么就合并(原属性的对象有的属性名保留)
                    {x:1}+{y:2}={x:1,y:2}
    */


    // console.dir(jQuery);
    jQuery.prototype.init.prototype = jQuery.prototype;
    root.jQuery = root.$ = jQuery;//让全局对象的$和jQuery属性 等于jQuery构造函数 既可以直接使用jQuery构造函数的方法 又可以创建一个jQuery的实例对象 使用原型上的方法
})(window)