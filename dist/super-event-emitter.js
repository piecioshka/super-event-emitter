(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventEmitter"] = factory();
	else
		root["EventEmitter"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author Piotr Kowalski <piecioshka@gmail.com> (https://piecioshka.pl/)
 * @name super-event-emitter
 * @description Lightweight and simple interpretation of popular event management
 * @version 4.1.9
 * @license MIT
 * @example
 * var bar = {}; // Or any other object.
 * EventEmitter.mixin(bar);
 * bar.on('foo', function () {
 *     console.log('foo event emitted');
 * });
 * bar.emit('foo');
 */



// Helpers.

function forEach(list, iterator) {
    var isForEachSupported = ('forEach' in Array.prototype);

    if (isForEachSupported) {
        list.forEach(iterator);
    } else {
        for (var i = 0; i < list.length; i += 1) {
            iterator(list[i]);
        }
    }
}

function filter(list, iterator) {
    var isFilterSupported = ('filter' in Array.prototype);

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
    return (typeof arg === 'string');
}

function isFunction(arg) {
    return (typeof arg === 'function');
}

/**
 * Add an event listener. Note that this method is not part of the EventEmitter
 *  prototype to avoid polluting the namespace.
 *
 * @access private
 * @param {string} name - Name of event to listen to.
 * @param {Function} fn - The function to represent this listener. Used for
 *  comparison when removing the listener.
 * @param {Function} run - The actual function to run when the named event is
 *  emitted. This can differ if e.g. clean-up is needed. ".once" uses this.
 * @param {Object} [ctx] - The context to use as "this" for the listener.
 */
function addListener(name, fn, run, ctx) {
    assert(isString(name), 'EventEmitter#on: name is not a string');
    assert(isFunction(fn), 'EventEmitter#on: fn is not a function');

    // If the context is not passed, use `this`.
    ctx = ctx || this;

    // Push to private lists of listeners.
    this._listeners.push({
        name: name,
        fn: fn,
        run: run,
        ctx: ctx
    });
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
        // For "on" functions, the runner is the same as the underlying
        // function. See "once" for when the distinction matters.
        addListener.call(this, name, fn, fn, ctx);
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

        // Here, we use a different runner function than the added listener.
        // This enables us to remove the listener after the function runs.
        function onHandler() {
            fn.apply(ctx, arguments);
            self.off(name, fn);
        }

        addListener.call(this, name, fn, onHandler, ctx);

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
        this._listeners = !name
            ? []
            : filter(this._listeners, function (listener) {
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
                event.run.call(event.ctx, params);
            }

            // Special behaviour for wildcard - invoke each event handler.
            var isWildcard = (/^all|\*$/).test(event.name);

            if (isWildcard) {
                event.run.call(event.ctx, name, params);
            }
        });

        return this;
    }
};

// Aliases.
EventEmitterProto.addEventListener
    = EventEmitterProto.addListener
    = EventEmitterProto.bind
    = EventEmitterProto.on;
EventEmitterProto.removeEventListener
    = EventEmitterProto.removeListener
    = EventEmitterProto.unbind
    = EventEmitterProto.off;
EventEmitterProto.dispatchEventListener
    = EventEmitterProto.dispatchListener
    = EventEmitterProto.trigger
    = EventEmitterProto.emit;

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
EventEmitter.VERSION = "4.1.9";

// To import with destructuring assignment
EventEmitter.EventEmitter = EventEmitter;

// Exports.
module.exports = EventEmitter;


/***/ })
/******/ ]);
});
//# sourceMappingURL=super-event-emitter.js.map