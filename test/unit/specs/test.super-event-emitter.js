'use strict';

var EventEmitter = require('../../../index');

describe('EventEmitter', function () {
    var Entity, spyFn;

    it('should exists', function () {
        expect(EventEmitter).toBeDefined();
        expect(EventEmitter).not.toBeNull();
        expect(typeof EventEmitter).toBe('function');
    });

    beforeEach(function () {
        Entity = EventEmitter.mixin({});
        spyFn = jasmine.createSpy('spyFn');
    });

    describe('creation', function() {
        it('should allow manual instantiation', function() {
            var instance = new EventEmitter();
            instance.on('foo', spyFn);
            instance.emit('foo');
            expect(spyFn).toHaveBeenCalled();
        });

        it('should create a new instance when called without `new`', function() {
            var instance = EventEmitter();
            var instance2 = EventEmitter();

            expect(instance).not.toBe(instance2);
            expect(instance.on).toBeDefined();
        });

        it('should allow mixing with existing objects', function() {
            var existing = {};
            EventEmitter.mixin(existing);
            existing.on('foo', spyFn);
            existing.emit('foo');
            expect(spyFn).toHaveBeenCalled();
        });

        it('should have basic methods defined', function() {
            ['on', 'once', 'off', 'emit'].forEach(function(name) {
                expect(Entity[name]).toBeDefined();
                expect(Entity[name]).toEqual(jasmine.any(Function));
            });
        });

        it('should have all aliases defined', function() {
            ['addEventListener', 'addListener', 'bind'].forEach(function(name) {
                expect(Entity[name]).toBeDefined();
                expect(Entity[name]).toBe(EventEmitter.prototype.on);
            });
            ['removeEventListener', 'removeListener', 'unbind'].forEach(function(name) {
                expect(Entity[name]).toBeDefined();
                expect(Entity[name]).toBe(EventEmitter.prototype.off);
            });
            ['trigger'].forEach(function(name) {
                expect(Entity[name]).toBeDefined();
                expect(Entity[name]).toBe(EventEmitter.prototype.emit);
            });
        });

        it('should encapsulate data', function() {
            var Entity2 = EventEmitter.mixin({});
            Entity.on('foo', function() {});
            Entity2.on('foo', spyFn);
            Entity.emit('foo');
            expect(spyFn).not.toHaveBeenCalled();
        });

        it('should create empty list of listeners', function () {
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
        });
    });

    describe('on', function () {
        it('can add listener', function () {
            Entity.on('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).toHaveBeenCalled();
        });

        it('can add listener with custom context', function () {
            var env = { foo: 'bar' };
            Entity.on('foo', function () {
                expect(this.foo).toBe('bar');
            }, env);
            Entity.emit('foo');
        });

        it('can add listener with expected params', function () {
            Entity.on('foo', spyFn);
            Entity.emit('foo', { 'foo': 'bar' });

            expect(spyFn).toHaveBeenCalledWith({ 'foo': 'bar' });
        });

        it('should throw error when try run with bad params', function () {
            expect(function () {
                Entity.on();
            }).toThrow();
            expect(function () {
                Entity.on(12);
            }).toThrow();
            expect(function () {
                Entity.on('foo');
            }).toThrow();
            expect(function () {
                Entity.on('foo', 123);
            }).toThrow();
            expect(function () {
                Entity.on('foo', Function);
            }).not.toThrow();
        });

        it('should support event "all"', function (done) {
            Entity.on('all', function (eventName, payload) {
                expect(eventName).toBe('something-on');
                expect(payload.name).toBe('iPhone');
                done();
            });

            Entity.emit('something-on', { name: 'iPhone' });
        });

        it('should allow chaining onces', function() {
            Entity.on('foo', spyFn).on('foo', spyFn);
            Entity.emit('foo');
            expect(spyFn).toHaveBeenCalledTimes(2);
        });
    });

    describe('once', function () {
        it('can add listener which will be run only one time', function () {
            Entity.once('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).toHaveBeenCalled();
            expect(Entity._listeners.length).toEqual(0);
        });

        it('should throw error when try run with bad params', function () {
            expect(function () {
                Entity.once();
            }).toThrow();
        });

        it('should support event "all"', function (done) {
            Entity.once('all', function (eventName, payload) {
                expect(eventName).toBe('something-once');
                expect(payload.name).toBe('iPad');
                done();
            });

            Entity.emit('something-once', { name: 'iPad' });
        });

        it('should not remove listeners list', function () {
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
            expect(Entity._listeners.length).toBe(0);
            Entity.once('foo', spyFn);
            Entity.emit('foo');
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
            expect(Entity._listeners.length).toBe(0);
        });

        it('should allow chaining onces', function() {
            Entity.once('foo', spyFn).once('foo', spyFn);
            Entity.emit('foo');
            expect(spyFn).toHaveBeenCalledTimes(2);
        });
    });

    describe('off', function () {
        it('should disable concrete listeners', function () {
            Entity.on('foo', spyFn);
            Entity.off('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).not.toHaveBeenCalled();
        });

        it('should disable all listeners with passed name', function () {
            Entity.on('foo', spyFn);
            Entity.on('foo', spyFn);
            Entity.off('foo');
            Entity.emit('foo');

            expect(spyFn).not.toHaveBeenCalled();
        });

        it('should disable all listeners', function () {
            Entity.on('foo', spyFn);
            Entity.on('bar', spyFn);
            Entity.on('baz', spyFn);
            Entity.off();
            Entity.emit('foo');

            expect(spyFn).not.toHaveBeenCalled();
        });

        it('should disable only listener with a specified callback', function() {
            var callback = jasmine.createSpy('callback');
            Entity.on('foo', callback);
            Entity.on('foo', spyFn);
            Entity.off('foo', callback);
            Entity.emit('foo');

            expect(spyFn).toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should not throw error when try run with bad params', function () {
            expect(function () {
                Entity.off();
            }).not.toThrow();
        });

        it('should not remove listeners list', function () {
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
            expect(Entity._listeners.length).toBe(0);
            Entity.once('foo', spyFn);
            Entity.emit('foo');
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
            expect(Entity._listeners.length).toBe(0);
        });

        it('should allow chaining offs', function() {
            var spyFn2 = jasmine.createSpy('spyFn2');
            Entity.on('foo', spyFn);
            Entity.on('foo', spyFn2);
            Entity.off('foo', spyFn).off('foo', spyFn2);
            Entity.emit('foo');
            expect(spyFn).not.toHaveBeenCalled();
            expect(spyFn2).not.toHaveBeenCalled();
        });
    });

    describe('emit', function () {
        it('should call all listeners with passed name', function () {
            Entity.on('foo', spyFn);
            expect(spyFn).not.toHaveBeenCalled();
            Entity.emit('foo');
            expect(spyFn).toHaveBeenCalled();
        });

        it('should throw error when try run with bad params', function () {
            expect(function () {
                Entity.emit();
            }).toThrow();
        });

        it('should call handler in setup order', function () {
            var point = 2;

            Entity.on('order', function () {
                point *= 2;
            });

            Entity.on('order', function () {
                point += 2;
            });

            Entity.emit('order');

            expect(point).toEqual(6);
        });

        it('should allow passing params', function() {
            Entity.on('foo', spyFn);
            Entity.emit('foo', 'params');
            expect(spyFn).toHaveBeenCalledWith('params');
        });

        it('should allow chaining emits', function() {
            Entity.on('foo', spyFn);
            Entity.emit('foo').emit('foo');
            expect(spyFn).toHaveBeenCalledTimes(2);
        });
    });
});
