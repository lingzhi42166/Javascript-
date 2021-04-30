;
(function(root) {
	/* 
		require:
			引入模块 当模块加载完毕后 把模块的接口对象 传递给回调函数 并执行回调函数
			当模块加载的时候 define会执行 如果define有依赖 那么通过require引入模块 并把模块的接口对象传递给回调函数
	*/
	var modMap = {};
	var require = function(deps, callback) {
		new require.prototype.init(deps, callback);
	}
	// 原型链查找机制 先从本身查找 如果没有就通过__proto__属性向原型对象查找 直到顶级
	require.prototype = {
		constructor: require,
		init: function(deps, callback) {
			if (deps.length == 0) callback;
			this.index = 0;
			this.options = [];
			this.depsLen = deps.length;
			// 遍历依赖数组 加载每一个依赖文件
			for (var i = 0; i < this.depsLen; i++) {
				this.loadMod(deps[i], callback);
			}
		},
		loadMod: function(name, callback) {
			if (modMap[name]) return
			modMap[name] = {
				status: "loading"
			}
			
			this.loadScript(name, callback);
		},
		loadScript: function(name, callback) {
			var _this = this;
			var node = document.createElement("script");
			node.src = name + ".js";
			document.body.appendChild(node);
			node.onload = function() {
				require(modMap[name].deps,modMap[name].callback);
				_this.index = _this.index + 1;
				_this.options.push(modMap[name].callback());
				if (_this.index == _this.depsLen) {
					callback.apply(null,_this.options);
				}
			}
		}

	}
	var define = function(name, deps, callback) {
		modMap[name] = modMap[name] || {};
		modMap[name].deps = deps;
		modMap[name].callback = callback;
		modMap[name].status = "loaded";
		
	}
	require.prototype.init.prototype = require.prototype;
	root.require = require;
	root.define = define;
})(this)
