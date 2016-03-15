'use strict';

var EventEmitter = require('../../lib/EventEmitter');

describe('EventEmitter', function () {
    'use strict';

    var Entity, spyFn;

    it('should exists', function () {
        expect(EventEmitter).toBeDefined();
        expect(EventEmitter).not.toBeNull();
        expect(typeof EventEmitter).toBe('object');
        expect(EventEmitter.prototype).toEqual(undefined);
    });

    beforeEach(function () {
        Entity = EventEmitter.mixin({});
        spyFn = jasmine.createSpy('spyFn');
    });

    describe('on', function () {
        it('should create empty list of listeners', function () {
            expect(Entity._listeners).toBe(undefined);
            Entity.on('foo', spyFn);
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
        });

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
            expect(function () { Entity.on(); }).toThrow();
            expect(function () { Entity.on(12); }).toThrow();
            expect(function () { Entity.on('foo'); }).toThrow();
            expect(function () { Entity.on('foo', 123); }).toThrow();
            expect(function () { Entity.on('foo', Function); }).not.toThrow();
        });
    });

    describe('once', function () {
        it('should create empty list of listeners', function () {
            expect(Entity._listeners).toBe(undefined);
            Entity.once('foo', spyFn);
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
        });

        it('can add listener which will be run only one time', function () {
            Entity.once('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).toHaveBeenCalled();
            expect(Entity._listeners.length).toEqual(0);
        });

        it('should throw error when try run with bad params', function () {
            expect(function () { Entity.once(); }).toThrow();
        });
    });

    describe('off', function () {
        it('should create empty list of listeners', function () {
            expect(Entity._listeners).toBe(undefined);
            Entity.off('foo', spyFn);
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
        });

        it('should disable concrete listeners', function () {
            Entity.on('foo', spyFn);
            Entity.off('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).not.toHaveBeenCalled();
        });

        it('should disable all listeners with passed name', function () {
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

        it('should not throw error when try run with bad params', function () {
            expect(function () { Entity.off(); }).not.toThrow();
        });
    });

    describe('emit', function () {
        it('should create empty list of listeners', function () {
            expect(Entity._listeners).toBe(undefined);
            Entity.emit('foo', spyFn);
            expect(Object.prototype.toString.call(Entity._listeners)).toBe('[object Array]');
        });

        it('should disable all listeners with passed name', function () {
            var isCalled = false;
            Entity.on('foo', function () {
                isCalled = true;
            });

            expect(isCalled).toBeFalsy();

            Entity.emit('foo');

            expect(isCalled).toBeTruthy();
        });

        it('should throw error when try run with bad params', function () {
            expect(function () { Entity.emit(); }).toThrow();
        });
    });
});
