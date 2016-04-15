/**
 * @author Piotr Kowalski
 * @license The MIT License
 * @example
 * EventEmitter.mixin(bar);
 * bar.on('foo', function () {
 *     console.log('foo event emitted');
 * });
 * bar.emit('foo');
 */
'use strict';

// Helpers.

function toString(arg) {
    return Object.prototype.toString.call(arg);
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'Assertion Error');
}

function forEach(list, iterator, context) {
    context = context || {};
    list = list || [];
    Array.prototype.forEach.call(list, iterator.bind(context));
}

function isString(arg) {
    return typeof arg === 'string';
}

function isFunction(arg) {
    return typeof arg === 'function';
}

function isArray(arg) {
    return toString(arg) === '[object Array]';
}

function ensureArray(potentialArray) {
    if (!isArray(potentialArray)) {
        return [];
    } else {
        return potentialArray;
    }
}

// Main part.

/**
 * @typedef {Object} EventEmitter
 * @description Super small and simple interpretation of popular event management.
 */
var EventEmitter = {
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

        this._listeners = ensureArray(this._listeners);

        // Push to private lists of listeners.
        this._listeners.push({
            name: name,
            fn: fn,
            // If the context is not passed, use `this`.
            ctx: ctx || this
        });
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
    },

    /**
     * Unregister listener.
     * Remove concrete listener by name and itself definition.
     *
     * @param {string} [name]
     * @param {Function} [fn]
     */
    off: function (name, fn) {
        this._listeners = !name ? [] : ensureArray(this._listeners).filter(function (listener, index) {
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

        forEach(ensureArray(this._listeners), function (event) {
            if (event.name === name) {
                event.fn.call(event.ctx, params);
            }

            if (event.name === 'all') {
                event.fn.call(event.ctx, name, params);
            }
        });
    },

    /**
     * Mixin properties.
     * Best way to setup EventEmitter on any object.
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


// Aliases.

EventEmitter.addEventListener = EventEmitter.addListener = EventEmitter.bind = EventEmitter.on;
EventEmitter.removeEventListener = EventEmitter.removeListener = EventEmitter.unbind = EventEmitter.off;
EventEmitter.trigger = EventEmitter.emit;


// Export `EventEmitter`.
module.exports = EventEmitter;
