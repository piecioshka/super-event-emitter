describe('EventEmitter', function () {

    it('should exists', function () {
        expect(EventEmitter).toBeDefined();
        expect(EventEmitter).not.toBeNull();
        expect(typeof EventEmitter).toBe('object')
    });

    describe('General', function () {
        var Entity, spyFn;

        beforeEach(function () {
            Entity = Object.create(EventEmitter);
            spyFn = jasmine.createSpy('spyFn');
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

        it('should disable listeners', function () {
            Entity.on('foo', spyFn);
            Entity.off('foo', spyFn);
            Entity.emit('foo');

            expect(spyFn).not.toHaveBeenCalled();
        });
    });
});