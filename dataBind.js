/**
 * @authors hexg (justpeth@163.com)
 * @date    2017-12-24 20:34:41
 */
 ;(function (w,d,undefined) {
 	function DataBind () {
 		// 含有data-bind属性的标签对应的监听队列
 		this.watchers = [];
	    var self = this;
	    // 找到全局中所有还含有data-bind自定义属性的元素
	    var elements = d.querySelectorAll('[data-bind]');
	    // 对每个含有data-bind的元素绑定watch事件
	    for(var i = 0, len =elements.length; i < len; i++){
	        (function(i) {
	        	var bindName = elements[i].getAttribute('data-bind');
	            self.watch(function() {
	                return self.getVal(bindName);
	            }, function() {
	            	// 获取到标签类型
	                var tagName = elements[i].tagName.toLowerCase();
	                if(tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
	                	// 对input select textarea赋值
	                    elements[i].value = self.getVal(bindName);
	                } else {
	                	// 对其他元素赋值
	                    elements[i].innerHTML = self.getVal(bindName);
	                }
	            });
	        })(i);
	    }
	    // 元素事件处理
	    function elmentEvent(e) {
	        var target = e.target || e.srcElemnt;
	        // 获取到对应绑定的属性名字
	        var bindName = target.getAttribute('data-bind');
	        if(bindName && bindName !== '') {
	        	// 设置对应的值 并且进行脏检测
	            self.setVal(bindName, target.value);
	            self.digest();
	        }
	    }
	    // 全局事件委派 进行兼容处理
	    if(d.addEventListener) {
	        d.addEventListener('keyup', elmentEvent, false);
	        d.addEventListener('change', elmentEvent, false);
	    } else {
	        d.attachEvent('onkeyup', elmentEvent);
	        d.attachEvent('onchange', elmentEvent);
	    } 
 	}
 	DataBind.prototype = {
 		// 含有data-bind元素的添加到监听队列中
 		watch: function(getValFun, fun) {
		    this.watchers.push({
		        getVal: getValFun,
		        callback: fun || function() {}
		    });
		},
		// 执行脏检测 
		digest: function() {
		    var dirty;
		    // 循环检测 含有data-bind的属性值是否发生改变 如果改变 则进行监听队列的回调函数 进行重新赋值
		    do { 
		        dirty = false;
		        for(var i = 0,len = this.watchers.length; i < len; i++) {
		            var newVal = this.watchers[i].getVal(),
		                oldVal = this.watchers[i].last;

		            if(newVal !== oldVal) {
		                this.watchers[i].callback(newVal, oldVal);
		                dirty = true;
		                this.watchers[i].last = newVal;
		            }
		        }
		    } while(dirty);
		},
		// 获取到data-bind对应属性的 值
		getVal: function(bindName) {
		    var key = bindName.split('.');
		    var result = this;
		    for(var i = 0, len = key.length; i < len; i++) {
		        result = result[key[i]];
		    }
		    return result;
		},
		// 对data-bind的属性设置新的值
		setVal: function(bindName, value) {
		    var key = bindName.split('.');
		    var result = this;
		    for(var i = 0, len = key.length - 1;i < len; i++) {
		        result = result[key[i]];
		    }
		    result[key[i]] = value;
		}
 	};
 	window.dataBind = function(){
 		var dataBind = new DataBind();
 		return dataBind;
 	}
 })(window,document);
