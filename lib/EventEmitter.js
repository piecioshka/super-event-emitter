/**
 * @author: Piotr Kowalski
 * @license: The MIT License
 * @version: 2.1.0
 * @build: 2015-12-30 01:10:44
 * @example:
 *   EventEmitter.mixin(bar);
 *   bar.on('test', function () {
 *     console.log('triggered!');
 *   });
 *   bar.emit('test');
 */
(function (root) {
    'use strict';

    var toString = function (arg) {
        return Object.prototype.toString.call(arg);
    };
    var assert = function (cond, msg) {
        if (!cond) throw new Error(msg || 'Assertion Error');
    };
    var each = function (list, iterator, ctx) {
        ctx = ctx || {};
        list = list || [];
        Array.prototype.forEach.call(list, iterator.bind(ctx));
    };
    var isString = function (arg) {
        return typeof arg === 'string';
    };
    var isFunction = function (arg) {
        return typeof arg === 'function';
    };
    var isArray = function (arg) {
        return toString(arg) === '[object Array]';
    };

    var EventEmitter = {

        /**
         * Register listener.
         *
         * @param {string} name
         * @param {Function} fn
         * @param {Object} [ctx]
         */
        on: function on(name, fn, ctx) {
            assert(isString(name), 'EventEmitter#on: `name` is not a string');
            assert(isFunction(fn), 'EventEmitter#on: `fn` is not a function');

            if (!isArray(this._listeners)) {
                this._listeners = [];
            }

            // Push to private lists of listeners.
            this._listeners.push({
                name: name,
                fn: fn,
                // If the context is not passed, use `this`.
                ctx: ctx || this
            });
        },

        /**
         * Register listener. Remove them after once event triggered.
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
        },

        /**
         * Unregister listener.
         *
         * @param {string} [name]
         * @param {Function} [fn]
         */
        off: function (name, fn) {
            if (!isArray(this._listeners)) {
                this._listeners = [];
            }

            each(this._listeners, function (listener, index) {
                if (name) {
                    if (listener.name === name) {
                        if (isFunction(fn)) {
                            if (listener.fn === fn) {
                                this._listeners.splice(index, 1);
                            }
                        } else {
                            this._listeners.splice(index, 1);
                        }
                    }
                } else {
                    this._listeners.splice(index, 1);
                }
            }, this);
        },

        /**
         * Trigger event.
         *
         * @param {string} name
         * @param {Object} [params]
         */
        emit: function emit(name, params) {
            assert(isString(name), 'EventEmitter#emit: `name` is not a string');

            if (!isArray(this._listeners)) {
                this._listeners = [];
            }

            each(this._listeners, function (event) {
                if (event.name === name) {
                    event.fn.call(event.ctx, params);
                }
            });
        },

        /**
         * Mixin properties.
         *
         * @param {Object} target
         */
        mixin: function (target) {
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    target[key] = this[key];
                }
            }

            return target;
        }

    };


    // Export `EventEmitter`.

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EventEmitter;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    } else {
        root.EventEmitter = EventEmitter
    }

}(this));
