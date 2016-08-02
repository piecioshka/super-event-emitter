(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Piotr Kowalski <piecioshka@gmail.com> (https://piecioshka.pl/)
	 * @name super-event-emitter
	 * @description Super small (2KB) and simple interpretation of popular event management.
	 * @version 4.1.3
	 * @license MIT
	 * @example
	 * EventEmitter.mixin(bar);
	 * bar.on('foo', function () {
	 *     console.log('foo event emitted');
	 * });
	 * bar.emit('foo');
	 */
	
	'use strict';
	
	var pkg = __webpack_require__(1);
	
	// Helpers.
	
	function forEach(list, iterator) {
	    var isForEachSupported = 'forEach' in Array.prototype;
	
	    if (isForEachSupported) {
	        list.forEach(iterator);
	    } else {
	        for (var i = 0; i < list.length; i += 1) {
	            iterator(list[i]);
	        }
	    }
	}
	
	function filter(list, iterator) {
	    var isFilterSupported = 'filter' in Array.prototype;
	
	    if (isFilterSupported) {
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
	    if (!cond) throw new Error(msg);
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
	        assert(isString(name), 'EventEmitter#on: name is not a string');
	        assert(isFunction(fn), 'EventEmitter#on: fn is not a function');
	
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
	        // If the context is not passed, use `this`.
	        ctx = ctx || this;
	
	        var self = this;
	
	        function onHandler() {
	            fn.apply(ctx, arguments);
	            self.off(name, onHandler);
	        }
	
	        this.on(name, onHandler, ctx);
	
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
	        assert(isString(name), 'EventEmitter#emit: name is not a string');
	
	        forEach(this._listeners, function (event) {
	            if (event.name === name) {
	                event.fn.call(event.ctx, params);
	            }
	
	            // Special behaviour for wildcard - invoke each event handler.
	            var isWildcard = (/^all|\*$/).test(event.name);
	
	            if (isWildcard) {
	                event.fn.call(event.ctx, name, params);
	            }
	        });
	
	        return this;
	    }
	};
	
	// Aliases.
	EventEmitterProto.addEventListener = EventEmitterProto.addListener = EventEmitterProto.bind = EventEmitterProto.on;
	EventEmitterProto.removeEventListener = EventEmitterProto.removeListener = EventEmitterProto.unbind = EventEmitterProto.off;
	EventEmitterProto.dispatchEventListener = EventEmitterProto.dispatchListener = EventEmitterProto.trigger = EventEmitterProto.emit;
	
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
	
	// Put project version.
	EventEmitter.VERSION = pkg.version;
	
	// Exports.
	module.exports = EventEmitter;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"name": "super-event-emitter",
		"description": "Super small (2KB) and simple interpretation of popular event management.",
		"version": "4.1.3",
		"license": "MIT",
		"author": {
			"name": "Piotr Kowalski",
			"email": "piecioshka@gmail.com",
			"url": "https://piecioshka.pl/"
		},
		"scripts": {
			"build": "webpack --profile",
			"watch": "webpack -w",
			"test": "jasmine JASMINE_CONFIG_PATH=test/unit/jasmine.json",
			"coverage": "istanbul cover jasmine JASMINE_CONFIG_PATH=test/unit/jasmine.json",
			"coveralls": "npm run coverage && cat ./coverage/lcov.info | coveralls -v"
		},
		"keywords": [
			"super",
			"event",
			"emitter",
			"mixin",
			"on",
			"off",
			"emit",
			"trigger",
			"simple"
		],
		"repository": {
			"type": "git",
			"url": "http://github.com/piecioshka/super-event-emitter.git"
		},
		"devDependencies": {
			"coveralls": "^2.11.12",
			"istanbul": "^0.4.4",
			"jasmine": "^2.4.1",
			"json-loader": "^0.5.4",
			"string-replace-loader": "^1.0.3",
			"webpack": "^1.12.14"
		},
		"files": [
			"dist",
			"package.json",
			"README.md"
		],
		"main": "./dist/super-event-emitter.min.js"
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=super-event-emitter.js.map