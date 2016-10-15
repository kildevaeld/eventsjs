/**
 *
 *
 * @export
 * @class EventEmitterError
 * @extends {Error}
 */
export declare class EventEmitterError extends Error {
    message: string;
    method: string;
    klass: any;
    ctx: any;
    /**
     * Creates an instance of EventEmitterError.
     *
     * @param {string} [message]
     * @param {string} [method]
     * @param {*} [klass]
     * @param {*} [ctx]
     *
     * @memberOf EventEmitterError
     */
    constructor(message: string, method?: string, klass?: any, ctx?: any);
    /**
     *
     *
     * @returns
     *
     * @memberOf EventEmitterError
     */
    toString(): string;
}
/**
 *
 *
 * @export
 * @interface EventHandler
 */
export interface EventHandler {
    (...args: any[]): any;
}
/**
 *
 *
 * @export
 * @interface Events
 */
export interface Events {
    /**
     *
     *
     * @type {string}
     * @memberOf Events
     */
    name: string;
    /**
     *
     *
     * @type {boolean}
     * @memberOf Events
     */
    once: boolean;
    /**
     *
     *
     * @type {EventHandler}
     * @memberOf Events
     */
    handler: EventHandler;
    /**
     *
     *
     * @type {*}
     * @memberOf Events
     */
    ctx?: any;
}
/**
 *
 *
 * @export
 * @interface IEventEmitter
 */
export interface IEventEmitter {
    /**
     *
     *
     * @type {{ [key: string]: Events[] }}
     * @memberOf IEventEmitter
     */
    listeners?: {
        [key: string]: Events[];
    };
    /**
     *
     *
     * @type {string}
     * @memberOf IEventEmitter
     */
    listenId?: string;
    /**
     *
     *
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf IEventEmitter
     */
    on(event: string, fn: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf IEventEmitter
     */
    once(event: string, fn: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {string} event
     * @param {EventHandler} [fn]
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf IEventEmitter
     */
    off(event: string, fn?: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {string} event
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf IEventEmitter
     */
    trigger(event: string, ...args: any[]): any;
}
/**
 *
 *
 * @export
 * @interface Destroyable
 */
export interface Destroyable {
    /**
     *
     *
     *
     * @memberOf Destroyable
     */
    destroy(): any;
}
/**
 *
 *
 * @export
 * @param {Events[]} fn
 * @param {any[]} [args=[]]
 * @returns
 */
export declare function callFunc(fn: Events[], args?: any[]): void;
/**
 *
 *
 * @export
 * @param {*} a
 * @returns {a is Function}
 */
export declare function isFunction(a: any): a is Function;
/**
 *
 *
 * @export
 * @param {*} a
 * @returns {a is EventEmitter}
 */
export declare function isEventEmitter(a: any): a is EventEmitter;
/**
 *
 *
 * @export
 * @class EventEmitter
 * @implements {IEventEmitter}
 * @implements {Destroyable}
 */
export declare class EventEmitter implements IEventEmitter, Destroyable {
    /**
     *
     *
     * @static
     * @type {boolean}
     * @memberOf EventEmitter
     */
    static throwOnError: boolean;
    /**
     *
     *
     * @static
     *
     * @memberOf EventEmitter
     */
    static debugCallback: (className: string, name: string, event: string, args: any[], listeners: Events[]) => void;
    /**
     *
     *
     * @static
     *
     * @memberOf EventEmitter
     */
    static executeListenerFunction: (func: Events[], args?: any[]) => void;
    /**
     *
     *
     * @type {string}
     * @memberOf EventEmitter
     */
    listenId: string;
    private _listeners;
    private _listeningTo;
    /**
     *
     *
     * @readonly
     * @type {{ [key: string]: Events[] }}
     * @memberOf EventEmitter
     */
    readonly listeners: {
        [key: string]: Events[];
    };
    /**
     *
     *
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @param {boolean} [once=false]
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    on(event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    /**
     *
     *
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    once(event: string, fn: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {string} [eventName]
     * @param {EventHandler} [fn]
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    off(eventName?: string, fn?: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {string} eventName
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    trigger(eventName: string, ...args: any[]): any;
    /**
     *
     *
     * @param {Events[]} func
     * @param {any[]} [args]
     *
     * @memberOf EventEmitter
     */
    _executeListener(func: Events[], args?: any[]): void;
    /**
     *
     *
     * @param {IEventEmitter} obj
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @param {boolean} [once=false]
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    /**
     *
     *
     * @param {IEventEmitter} obj
     * @param {string} event
     * @param {EventHandler} fn
     * @param {*} [ctx]
     * @returns {*}
     *
     * @memberOf EventEmitter
     */
    listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any;
    /**
     *
     *
     * @param {IEventEmitter} [obj]
     * @param {string} [event]
     * @param {EventHandler} [callback]
     * @returns
     *
     * @memberOf EventEmitter
     */
    stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler): this;
    /**
     *
     *
     *
     * @memberOf EventEmitter
     */
    destroy(): void;
}
