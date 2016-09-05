export declare class EventEmitterError extends Error {
    message: string;
    method: string;
    ctx: any;
    constructor(message?: string, method?: string, ctx?: any);
    toString(): string;
}
export interface EventHandler {
    (...args: any[]): any;
}
export interface Events {
    name: string;
    once: boolean;
    handler: EventHandler;
    ctx?: any;
}
export interface IEventEmitter {
    listeners: {
        [key: string]: Events[];
    };
    listenId?: string;
    on(event: string, fn: EventHandler, ctx?: any): any;
    once(event: string, fn: EventHandler, ctx?: any): any;
    off(event: string, fn?: EventHandler, ctx?: any): any;
    trigger(event: string, ...args: any[]): any;
}
export interface Destroyable {
    destroy(): any;
}
export declare function callFunc(fn: Events[], args?: any[]): void;
export declare function isFunction(a: any): a is Function;
export declare function isEventEmitter(a: any): a is EventEmitter;
export declare class EventEmitter implements IEventEmitter, Destroyable {
    static debugCallback: (className: string, name: string, event: string, args: any[], listeners: Events[]) => void;
    static executeListenerFunction: (func: Events[], args?: any[]) => void;
    listenId: string;
    private _listeners;
    private _listeningTo;
    listeners: {
        [key: string]: Events[];
    };
    on(event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    once(event: string, fn: EventHandler, ctx?: any): any;
    off(eventName?: string, fn?: EventHandler): any;
    trigger(eventName: string, ...args: any[]): any;
    _executeListener(func: Events[], args?: any[]): void;
    listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any;
    stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler): this;
    destroy(): void;
}
