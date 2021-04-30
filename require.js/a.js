
/*如果被定义的模块是一个独立模块，不需要依赖任何其他模块，可以直接用define方法生成。
define({
    x : 1,
    y : 2
}) */


/* 等价于上面的写法 但是函数的写法更加灵活 自由度更高 可以在函数的作用域内初始化模块代码
define(function(){
    var a = 1;
    var b = 2;
    return {
        x : a,
        y :b    
    }
}) */

// 数组成员是被依赖的模块
define("a",["b"], function (x) {
    // console.log(1);
	console.log(x);
    var a = 1;
    var b = 2;
    return {
        x : a,
        y : b
    }
});