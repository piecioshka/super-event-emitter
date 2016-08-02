/**
 * @author $AUTHOR$
 * @name $NAME$
 * @description $DESCRIPTION$
 * @version $VERSION$
 * @license $LICENSE$
 * @example
 * EventEmitter.mixin(bar);
 * bar.on('foo', function () {
 *     console.log('foo event emitted');
 * });
 * bar.emit('foo');
 */

'use strict';

var pkg = require('./package.json');

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
