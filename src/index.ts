/**
 * @author $AUTHOR$
 * @name $NAME$
 * @description $DESCRIPTION$
 * @version $VERSION$
 * @license $LICENSE$
 * @example
 * const bar = new SuperEventEmitter();
 * bar.on('foo', function () {
 *     console.log('foo event emitted');
 * });
 * bar.emit('foo');
 */

type MyEvent = {
    name: string;
    fn: (
        this: MyEvent["ctx"],
        nameOrPayload: string | any,
        payload?: any
    ) => void;
    run: MyEvent["fn"];
    ctx: unknown;
};

function assert(
    condition: boolean,
    msg: string | undefined
): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

function isString(arg: unknown): arg is string {
    return typeof arg === "string";
}

function isFunction(arg: unknown): arg is () => void {
    return typeof arg === "function";
}

/**
 * Add an event listener. Note that this method is not part of the EventEmitter
 */
function registerListener(
    this: SuperEventEmitter,
    label: string,
    name: MyEvent["name"],
    fn: MyEvent["fn"],
    run: MyEvent["run"],
    ctx: MyEvent["ctx"]
): void {
    assert(isString(name), `SuperEventEmitter#${label}: name is not a string`);
    assert(isFunction(fn), `SuperEventEmitter#${label}: fn is not a function`);

    // If the context is not passed, use `this`.
    ctx = ctx || this;

    // Push to private lists of listeners.
    this._listeners.push({ name, fn, run, ctx });
}

export class SuperEventEmitter {
    _listeners: MyEvent[] = [];

    /**
     * Register listener on concrete name with specified handler.
     */
    on = (
        name: MyEvent["name"],
        fn: MyEvent["fn"],
        ctx: MyEvent["ctx"] = this
    ) => {
        registerListener.call(this, "on", name, fn, fn, ctx);
        return this;
    };

    addEventListener = this.on;
    addListener = this.on;
    bind = this.on;

    /**
     * Register listener.
     * Remove them after once event triggered.
     */
    once = (
        name: MyEvent["name"],
        fn: MyEvent["fn"],
        ctx: MyEvent["ctx"] = this
    ) => {
        const self = this;

        function onceHandler(name: string, payload: any) {
            fn.call(ctx, name, payload);
            self.off(name, fn);
        }

        registerListener.call(this, "once", name, fn, onceHandler, ctx);

        return this;
    };

    /**
     * Unregister listener.
     * Remove concrete listener by name and itself definition.
     */
    off = (name?: MyEvent["name"], fn?: MyEvent["fn"]) => {
        this._listeners = !name
            ? []
            : this._listeners.filter(function (listener) {
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
    };

    removeEventListener = this.off;
    removeListener = this.off;
    unbind = this.off;

    /**
     * Trigger event.
     * All of listeners waiting for emit event will be executed.
     */
    emit = (name: MyEvent["name"], payload?: any) => {
        assert(isString(name), "SuperEventEmitter#emit: name is not a string");

        this._listeners.forEach(function (event) {
            if (event.name === name) {
                event.run.call(event.ctx, payload);
            }

            // Special behaviour for wildcard - invoke each event handler.
            const isWildcard = /^all|\*$/.test(event.name);

            if (isWildcard) {
                event.run.call(event.ctx, name, payload);
            }
        });

        return this;
    };

    dispatchEventListener = this.emit;
    dispatchListener = this.emit;
    trigger = this.emit;

    static mixin = function <T extends Record<string, any>>(
        target: T
    ): T & Record<keyof SuperEventEmitter, any> {
        const emitter = new SuperEventEmitter();

        for (let key in emitter) {
            const value = emitter[key as keyof SuperEventEmitter];
            (target as any)[key] = value;
        }

        return target;
    };

    static VERSION = "$VERSION$";
}

const a: keyof typeof SuperEventEmitter = "mixin";
