import { SuperEventEmitter } from "./index";

const toString = (entity: unknown) => Object.prototype.toString.call(entity);

describe("SuperEventEmitter", function () {
    let entity: SuperEventEmitter;
    let noop: () => void;

    describe("General", function () {
        it("should exists", function () {
            expect(SuperEventEmitter).toBeDefined();
            expect(SuperEventEmitter).not.toBeNull();
            expect(typeof SuperEventEmitter).toBe("function");
        });
    });

    describe("API", function () {
        beforeEach(function () {
            entity = new SuperEventEmitter();
            noop = jest.fn();
        });

        describe("Creation", function () {
            it("should allow manual instantiation", function () {
                const instance = new SuperEventEmitter();
                instance.on("foo", noop);
                instance.emit("foo");
                expect(noop).toHaveBeenCalled();
            });

            it("should not create a new instance when called without `new`", function () {
                expect(() => {
                    // @ts-expect-error
                    SuperEventEmitter();
                }).toThrow();
            });

            it("should allow mixing with existing objects", function () {
                const existing = {} as SuperEventEmitter;
                SuperEventEmitter.mixin(existing);
                existing.on("foo", noop);
                existing.emit("foo");
                expect(noop).toHaveBeenCalled();
            });

            it("should allow creating new mixins from the already mixed object", function () {
                const anotherMixedObject = SuperEventEmitter.mixin({});
                expect(anotherMixedObject.on).toBeDefined();

                const instance = new SuperEventEmitter();
                const anotherInstance = SuperEventEmitter.mixin({});
                expect(anotherInstance).not.toEqual(instance);
            });

            it("should have basic methods defined", function () {
                const methods: (keyof SuperEventEmitter)[] = [
                    "on",
                    "once",
                    "off",
                    "emit",
                ];
                methods.forEach(function (name) {
                    expect(entity[name]).toBeDefined();
                    expect(entity[name]).toEqual(expect.any(Function));
                });
            });

            it("should have all aliases defined", function () {
                const onAliases: (keyof SuperEventEmitter)[] = [
                    "addEventListener",
                    "addListener",
                    "bind",
                ];
                onAliases.forEach(function (name) {
                    expect(entity[name]).toBeDefined();
                    expect(entity[name]).toBe(entity.on);
                });
                const offAliases: (keyof SuperEventEmitter)[] = [
                    "removeEventListener",
                    "removeListener",
                    "unbind",
                ];
                offAliases.forEach(function (name) {
                    expect(entity[name]).toBeDefined();
                    expect(entity[name]).toBe(entity.off);
                });
                const emitAliases: (keyof SuperEventEmitter)[] = [
                    "dispatchEventListener",
                    "dispatchListener",
                    "trigger",
                ];
                emitAliases.forEach(function (name) {
                    expect(entity[name]).toBeDefined();
                    expect(entity[name]).toBe(entity.emit);
                });
            });

            it("should encapsulate data", function () {
                const callback1 = jest.fn();
                const callback2 = jest.fn();
                const entity2 = SuperEventEmitter.mixin({});
                entity.on("foo", callback1);
                entity2.on("foo", callback2);
                entity.emit("foo");
                expect(callback2).not.toHaveBeenCalled();
            });

            it("should create empty list of listeners", function () {
                expect(toString(entity._listeners)).toBe("[object Array]");
            });
        });

        describe("method: on", function () {
            it("can add listener", function () {
                entity.on("foo", noop);
                entity.emit("foo");

                expect(noop).toHaveBeenCalled();
            });

            it("can add listener with custom context", function () {
                const env = { foo: "bar" };
                entity.on(
                    "foo",
                    function () {
                        // @ts-ignore
                        expect(this.foo).toBe("bar");
                    },
                    env
                );
                entity.emit("foo");
            });

            it("can add listener with expected params", function () {
                entity.on("foo", noop);
                entity.emit("foo", { foo: "bar" });

                expect(noop).toHaveBeenCalledWith({ foo: "bar" });
            });

            it("should throw error when try run with incorrect params", function () {
                expect(function () {
                    // @ts-expect-error
                    entity.on();
                }).toThrow("SuperEventEmitter#on: name is not a string");
                expect(function () {
                    // @ts-expect-error
                    entity.on(12);
                }).toThrow("SuperEventEmitter#on: name is not a string");
                expect(function () {
                    // @ts-expect-error
                    entity.on("foo");
                }).toThrow("SuperEventEmitter#on: fn is not a function");
                expect(function () {
                    // @ts-expect-error
                    entity.on("foo", 123);
                }).toThrow("SuperEventEmitter#on: fn is not a function");
                expect(function () {
                    entity.on("foo", Function);
                }).not.toThrow();
            });

            it('should support event "all"', function (done) {
                entity.on(
                    "all",
                    (eventName: string, payload: { name: string }) => {
                        expect(eventName).toBe("something-on");
                        expect(payload.name).toBe("iPhone");
                        done();
                    }
                );

                entity.emit("something-on", { name: "iPhone" });
            });

            it('should support wildcard "*"', function (done) {
                entity.on(
                    "*",
                    (eventName: string, payload: { name: string }) => {
                        expect(eventName).toBe("something-on");
                        expect(payload.name).toBe("iPhone");
                        done();
                    }
                );

                entity.emit("something-on", { name: "iPhone" });
            });

            it("should allow chaining onces", function () {
                entity.on("foo", noop).on("foo", noop);
                entity.emit("foo");
                expect(noop).toHaveBeenCalledTimes(2);
            });
        });

        describe("method: once", function () {
            it("can add listener which will be run only one time", function () {
                entity.once("foo", noop);
                entity.emit("foo");

                expect(noop).toHaveBeenCalled();
                expect(entity._listeners.length).toEqual(0);
            });

            it("should throw error when try run with incorrect params", function () {
                expect(function () {
                    // @ts-expect-error
                    entity.once();
                }).toThrow("SuperEventEmitter#once: name is not a string");
                expect(function () {
                    // @ts-expect-error
                    entity.once(12);
                }).toThrow("SuperEventEmitter#once: name is not a string");
                expect(function () {
                    // @ts-expect-error
                    entity.once("foo");
                }).toThrow("SuperEventEmitter#once: fn is not a function");
                expect(function () {
                    // @ts-expect-error
                    entity.once("foo", 123);
                }).toThrow("SuperEventEmitter#once: fn is not a function");
                expect(function () {
                    entity.once("foo", Function);
                }).not.toThrow();
            });

            it('should support event "all"', function (done) {
                entity.once(
                    "all",
                    (eventName: string, payload: { name: string }) => {
                        expect(eventName).toBe("something-once");
                        expect(payload.name).toBe("iPad");
                        done();
                    }
                );

                entity.emit("something-once", { name: "iPad" });
            });

            it('should support wildcard "*"', function (done) {
                entity.once(
                    "*",
                    (eventName: string, payload: { name: string }) => {
                        expect(eventName).toBe("something-once");
                        expect(payload.name).toBe("iPad");
                        done();
                    }
                );

                entity.emit("something-once", { name: "iPad" });
            });

            it("should not remove listeners list", function () {
                expect(toString(entity._listeners)).toBe("[object Array]");
                expect(entity._listeners.length).toBe(0);
                entity.once("foo", noop);
                entity.emit("foo");
                expect(toString(entity._listeners)).toBe("[object Array]");
                expect(entity._listeners.length).toBe(0);
            });

            it("should allow chaining onces", function () {
                entity.once("foo", noop).once("foo", noop);
                entity.emit("foo");
                expect(noop).toHaveBeenCalledTimes(2);
            });
        });

        describe("method: off", function () {
            it("should disable concrete listeners", function () {
                entity.on("foo", noop);
                entity.off("foo", noop);
                entity.emit("foo");

                expect(noop).not.toHaveBeenCalled();
            });

            it("should disable all listeners with passed name", function () {
                entity.on("foo", noop);
                entity.on("foo", noop);
                entity.off("foo");
                entity.emit("foo");

                expect(noop).not.toHaveBeenCalled();
            });

            it("should disable all listeners", function () {
                entity.on("foo", noop);
                entity.on("bar", noop);
                entity.on("baz", noop);
                entity.off();
                entity.emit("foo");

                expect(noop).not.toHaveBeenCalled();
            });

            it("should disable only listener with a specified callback", function () {
                const callback = jest.fn();
                entity.on("foo", callback);
                entity.on("foo", noop);
                entity.off("foo", callback);
                entity.emit("foo");

                expect(noop).toHaveBeenCalled();
                expect(callback).not.toHaveBeenCalled();
            });

            it("should not throw error when try run with incorrect params", function () {
                expect(function () {
                    entity.off();
                }).not.toThrow();
            });

            it("should not remove listeners list", function () {
                expect(toString(entity._listeners)).toBe("[object Array]");
                expect(entity._listeners.length).toBe(0);
                entity.once("foo", noop);
                entity.emit("foo");
                expect(toString(entity._listeners)).toBe("[object Array]");
                expect(entity._listeners.length).toBe(0);
            });

            it("should allow chaining offs", function () {
                const spyFn2 = jest.fn();
                entity.on("foo", noop);
                entity.on("foo", spyFn2);
                entity.off("foo", noop).off("foo", spyFn2);
                entity.emit("foo");
                expect(noop).not.toHaveBeenCalled();
                expect(spyFn2).not.toHaveBeenCalled();
            });

            it("should remove listener for an event registered by once()", function () {
                entity.once("foo", noop);
                entity.off("foo", noop);
                entity.emit("foo");
                expect(noop).not.toHaveBeenCalled();
            });
        });

        describe("method: emit", function () {
            it("should call all listeners with passed name", function () {
                entity.on("foo", noop);
                expect(noop).not.toHaveBeenCalled();
                entity.emit("foo");
                expect(noop).toHaveBeenCalled();
            });

            it("should throw error when try run with incorrect params", function () {
                expect(function () {
                    // @ts-expect-error
                    entity.emit();
                }).toThrow();
            });

            it("should call handler in setup order", function () {
                let point = 2;

                entity.on("order", function () {
                    point *= 2;
                });

                entity.on("order", function () {
                    point += 2;
                });

                entity.emit("order");

                expect(point).toEqual(6);
            });

            it("should allow passing params", function () {
                entity.on("foo", noop);
                entity.emit("foo", "params");
                expect(noop).toHaveBeenCalledWith("params");
            });

            it("should allow chaining emits", function () {
                entity.on("foo", noop);
                entity.emit("foo").emit("foo");
                expect(noop).toHaveBeenCalledTimes(2);
            });
        });
    });
});
