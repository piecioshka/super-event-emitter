// Type definitions for EventEmitter 4.1.4
// Project: http://github.com/piecioshka/super-event-emitter

declare module "super-event-emitter" {
    export = EventEmitter;
}

declare class EventEmitter {
    on(name: string, handler: Function, context?: Object): EventEmitter;

    bind(name: string, handler: Function, context?: Object): EventEmitter;

    addListener(name: string, handler: Function, context?: Object): EventEmitter;

    addEventListener(name: string, handler: Function, context?: Object): EventEmitter;


    once(name: string, handler: Function, context?: Object): EventEmitter;


    off(name?: string, handler?: Function): EventEmitter;

    unbind(name?: string, handler?: Function): EventEmitter;

    removeListener(name?: string, handler?: Function): EventEmitter;

    removeEventListener(name?: string, handler?: Function): EventEmitter;


    emit(name: string, params?: Object): EventEmitter;

    trigger(name: string, params?: Object): EventEmitter;

    dispatchListener(name: string, params?: Object): EventEmitter;

    dispatchEventListener(name: string, params?: Object): EventEmitter;


    mixin(target: Object): Object;

    static mixin(target: Object): Object;

    static VERSION: string;
}
