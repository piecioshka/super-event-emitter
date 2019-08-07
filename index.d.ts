// Type definitions for EventEmitter 4.1.4
// Project: http://github.com/piecioshka/super-event-emitter

declare module "super-event-emitter" {
    export = EventEmitter;
}

type Handler = (payload?: any) => void;

declare class EventEmitter {
    on(name: string, handler: Handler, context?: any): EventEmitter;
    bind(name: string, handler: Handler, context?: any): EventEmitter;
    addListener(name: string, handler: Handler, context?: any): EventEmitter;
    addEventListener(name: string, handler: Handler, context?: any): EventEmitter;

    once(name: string, handler: Handler, context?: Object): EventEmitter;

    off(name?: string, handler?: Handler): EventEmitter;
    unbind(name?: string, handler?: Handler): EventEmitter;
    removeListener(name?: string, handler?: Handler): EventEmitter;
    removeEventListener(name?: string, handler?: Handler): EventEmitter;

    emit(name: string, params?: any): EventEmitter;
    trigger(name: string, params?: any): EventEmitter;
    dispatchListener(name: string, params?: any): EventEmitter;
    dispatchEventListener(name: string, params?: any): EventEmitter;

    mixin(target: T): T;

    static mixin(target: T): T;

    static VERSION: string;
}
