(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("EventEmitter", [], factory);
	else if(typeof exports === 'object')
		exports["EventEmitter"] = factory();
	else
		root["EventEmitter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * @author Piotr Kowalski
	 * @license The MIT License
	 * @description Super small (2KB) and simple interpretation of popular event management.
	 * @example
	 * EventEmitter.mixin(bar);
	 * bar.on('foo', function () {
	 *     console.log('foo event emitted');
	 * });
	 * bar.emit('foo');
	 */
	'use strict';
	
	// Helpers.
	var filterSupported = 'filter' in Array.prototype;
	var forEachSupported = 'forEach' in Array.prototype;
	
	function forEach(list, iterator) {
	    if (forEachSupported) {
	        list.forEach(iterator);
	    } else {
	        for (var i = 0; i < list.length; i += 1) {
	            iterator(list[i]);
	        }
	    }
	}
	
	function filter(list, iterator) {
	    if (filterSupported) {
	        return list.filter(iterator);
	    } else {
	        var result = [];
	        for (var i = 0; i < list.length; i += 1) {
	            var value = list[i];
	            if (iterator(value)) {
	                result.push(value);
	            }
	        }
	        return result;
	    }
	}
	
	function assert(cond, msg) {
	    if (!cond) throw new Error(msg || 'Assertion Error');
	}
	
	function isString(arg) {
	    return typeof arg === 'string';
	}
	
	function isFunction(arg) {
	    return typeof arg === 'function';
	}
	
	// Main part.
	
	var EventEmitterProto = {
	    /**
	     * Register listener on concrete name with specified handler.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     * @param {Object} [ctx]
	     */
	    on: function (name, fn, ctx) {
	        assert(isString(name), 'EventEmitter#on: `name` is not a string');
	        assert(isFunction(fn), 'EventEmitter#on: `fn` is not a function');
	
	        // If the context is not passed, use `this`.
	        ctx = ctx || this;
	
	        // Push to private lists of listeners.
	        this._listeners.push({
	            name: name,
	            fn: fn,
	            ctx: ctx
	        });
	
	        return this;
	    },
	
	    /**
	     * Register listener.
	     * Remove them after once event triggered.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     * @param {Object} [ctx]
	     */
	    once: function (name, fn, ctx) {
	        ctx = ctx || this;
	
	        var self = this;
	        var handle = function () {
	            fn.apply(ctx, arguments);
	            self.off(name, handle);
	        };
	
	        this.on(name, handle, ctx);
	
	        return this;
	    },
	
	    /**
	     * Unregister listener.
	     * Remove concrete listener by name and itself definition.
	     *
	     * @param {string} [name]
	     * @param {Function} [fn]
	     */
	    off: function (name, fn) {
	        this._listeners = !name ? [] : filter(this._listeners, function (listener) {
	            if (listener.name !== name) {
	                return true;
	            } else {
	                if (isFunction(fn)) {
	                    return listener.fn !== fn;
	                } else {
	                    return false;
	                }
	            }
	        });
	
	        return this;
	    },
	
	    /**
	     * Trigger event.
	     * All of listeners waiting for emit event will be executed.
	     *
	     * @param {string} name
	     * @param {Object} [params]
	     */
	    emit: function (name, params) {
	        assert(isString(name), 'EventEmitter#emit: `name` is not a string');
	
	        forEach(this._listeners, function (event) {
	            if (event.name === name) {
	                event.fn.call(event.ctx, params);
	            }
	
	            if (event.name === 'all') {
	                event.fn.call(event.ctx, name, params);
	            }
	        });
	
	        return this;
	    }
	};
	
	// Aliases.
	EventEmitterProto.addEventListener = EventEmitterProto.addListener = EventEmitterProto.bind = EventEmitterProto.on;
	EventEmitterProto.removeEventListener = EventEmitterProto.removeListener = EventEmitterProto.unbind = EventEmitterProto.off;
	EventEmitterProto.trigger = EventEmitterProto.emit;
	
	function EventEmitter() {
	    if (!(this instanceof EventEmitter)) {
	        return new EventEmitter();
	    }
	
	    this._listeners = [];
	}
	
	EventEmitter.prototype = EventEmitterProto;
	
	/**
	 * Mixin properties.
	 * Best way to setup EventEmitter on any object.
	 *
	 * @param {Object} target
	 */
	EventEmitter.mixin = function (target) {
	    var emitter = new EventEmitter();
	
	    for (var key in emitter) {
	        target[key] = emitter[key];
	    }
	
	    return target;
	};
	
	// Allow crating new mixed in objects from the instance.
	EventEmitter.prototype.mixin = EventEmitter.mixin;
	
	// Export `EventEmitter`.
	module.exports = EventEmitter;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=super-event-emitter.js.map