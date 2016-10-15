
var idCounter = 0
function getID(): string {
  return "" + (++idCounter)
}

/**
 * 
 * 
 * @export
 * @class EventEmitterError
 * @extends {Error}
 */
export class EventEmitterError extends Error {
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
  constructor(public message: string, public method?: string, public klass?: any, public ctx?: any) {
    super(message);
  }

  /**
   * 
   * 
   * @returns
   * 
   * @memberOf EventEmitterError
   */
  toString() {
    let prefix = "EventEmitterError";
    if (this.method && this.method != "") {
      prefix = `EventEmitter#${this.method}`;
    }
    return `${prefix}: ${this.message}`;
  }
}

/**
 * 
 * 
 * @export
 * @interface EventHandler
 */
export interface EventHandler {
  (...args: any[])
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
  name: string
  /**
   * 
   * 
   * @type {boolean}
   * @memberOf Events
   */
  once: boolean
  /**
   * 
   * 
   * @type {EventHandler}
   * @memberOf Events
   */
  handler: EventHandler
  /**
   * 
   * 
   * @type {*}
   * @memberOf Events
   */
  ctx?: any
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
  listeners?: { [key: string]: Events[] }
  /**
   * 
   * 
   * @type {string}
   * @memberOf IEventEmitter
   */
  listenId?: string
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
  on(event: string, fn: EventHandler, ctx?: any): any
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
  once(event: string, fn: EventHandler, ctx?: any): any
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
  off(event: string, fn?: EventHandler, ctx?: any): any
  /**
   * 
   * 
   * @param {string} event
   * @param {...any[]} args
   * @returns {*}
   * 
   * @memberOf IEventEmitter
   */
  trigger(event: string, ...args: any[]): any
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
  destroy();
}


function removeFromListener(listeners: Events[], fn: EventHandler, ctx: any) {

  for (let i = 0; i < listeners.length; i++) {
    let e = listeners[i];
    if ((fn == null && ctx != null && e.ctx === ctx) ||
      (fn != null && ctx == null && e.handler === fn) ||
      (fn != null && ctx != null && e.handler === fn && e.ctx === ctx)) {
      listeners.splice(i, 1);
    }
  }
  return listeners;
}

/**
 * 
 * 
 * @export
 * @param {Events[]} fn
 * @param {any[]} [args=[]]
 * @returns
 */
export function callFunc(fn: Events[], args: any[] = []) {
  let l = fn.length, i = -1, a1 = args[0], a2 = args[1],
    a3 = args[2], a4 = args[3];

  switch (args.length) {
    case 0: while (++i < l) fn[i].handler.call(fn[i].ctx); return;
    case 1: while (++i < l) fn[i].handler.call(fn[i].ctx, a1); return;
    case 2: while (++i < l) fn[i].handler.call(fn[i].ctx, a1, a2); return;
    case 3: while (++i < l) fn[i].handler.call(fn[i].ctx, a1, a2, a3); return;
    case 4: while (++i < l) fn[i].handler.call(fn[i].ctx, a1, a2, a3, a4); return;
    default: while (++i < l) fn[i].handler.apply(fn[i].ctx, args); return;
  }
}

/**
 * 
 * 
 * @export
 * @param {*} a
 * @returns {a is Function}
 */
export function isFunction(a: any): a is Function {
  return typeof a === 'function';
}

/**
 * 
 * 
 * @export
 * @param {*} a
 * @returns {a is EventEmitter}
 */
export function isEventEmitter(a: any): a is EventEmitter {
  return a && (a instanceof EventEmitter || (isFunction(a.on) && isFunction(a.once) && isFunction(a.off) && isFunction(a.trigger)));
}


/**
 * 
 * 
 * @export
 * @class EventEmitter
 * @implements {IEventEmitter}
 * @implements {Destroyable}
 */
export class EventEmitter implements IEventEmitter, Destroyable {
  /**
   * 
   * 
   * @static
   * @type {boolean}
   * @memberOf EventEmitter
   */
  static throwOnError: boolean = true;
  /**
   * 
   * 
   * @static
   * 
   * @memberOf EventEmitter
   */
  static debugCallback: (className: string, name: string, event: string, args: any[], listeners: Events[]) => void
  /**
   * 
   * 
   * @static
   * 
   * @memberOf EventEmitter
   */
  static executeListenerFunction: (func: Events[], args?: any[]) => void = function (func, args) {
    callFunc(func, args);
  }

  /**
   * 
   * 
   * @type {string}
   * @memberOf EventEmitter
   */
  listenId: string
  private _listeners: { [key: string]: Events[] }
  private _listeningTo: { [key: string]: any }

  /**
   * 
   * 
   * @readonly
   * @type {{ [key: string]: Events[] }}
   * @memberOf EventEmitter
   */
  public get listeners(): { [key: string]: Events[] } {
    return this._listeners;
  }

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
  on(event: string, fn: EventHandler, ctx?: any, once: boolean = false): any {
    let events = (this._listeners || (this._listeners = {}))[event] || (this._listeners[event] = []);

    events.push({
      name: event,
      once: once,
      handler: fn,
      ctx: ctx || this
    });

    return this
  }

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
  once(event: string, fn: EventHandler, ctx?: any): any {
    return this.on(event, fn, ctx, true);
  }

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
  off(eventName?: string, fn?: EventHandler, ctx?: any): any {
    this._listeners = this._listeners || {};
    if (eventName == null && ctx == null) {
      this._listeners = {};
    } else if (this._listeners[eventName]) {
      let events = this._listeners[eventName];
      if (fn == null && ctx == null) {
        this._listeners[eventName] = [];
      } else {
        /*for (let i = 0; i < events.length; i++) {
          let e = events[i];
          if ((fn == null && ctx != null && e.ctx === ctx) ||
            (fn != null && ctx == null && e.handler === fn) ||
            (fn != null && ctx != null && e.handler === fn && e.ctx === ctx)) {
            this._listeners[eventName].splice(i, 1);
          }
        }*/
        removeFromListener(events, fn, ctx);
      }

    } else {
      for (let en in this.listeners) {
        let l = this.listeners[en];
        removeFromListener(l, fn, ctx);
        /*for (let i = 0; i < l.length; i++) {
          let e = l[i];
          if ((fn == null && ctx != null && e.ctx === ctx) ||
            (fn != null && ctx == null && e.handler === fn) ||
            (fn != null && ctx != null && e.handler === fn && e.ctx === ctx)) {
            l.splice(i, 1);
          }
        }*/
      }
    }

    return this;
  }

  /**
   * 
   * 
   * @param {string} eventName
   * @param {...any[]} args
   * @returns {*}
   * 
   * @memberOf EventEmitter
   */
  trigger(eventName: string, ...args: any[]): any {

    this._listeners = this._listeners || {};
    let events = (this._listeners[eventName] || []).concat(this._listeners['all'] || []).concat(this._listeners["*"] || []);


    if (EventEmitter.debugCallback)
      EventEmitter.debugCallback((<any>this.constructor).name, (<any>this).name, eventName, args, events)

    let event, a, index;
    let calls: Events[] = [];
    let alls: Events[] = [];

    for (let i = 0, ii = events.length; i < ii; i++) {
      event = events[i]
      a = args

      if (events[i].name == 'all' || events[i].name == '*') {
        alls.push(events[i]);
      } else {
        calls.push(events[i]);
      }

      if (events[i].once === true) {
        index = this._listeners[events[i].name].indexOf(events[i])
        this._listeners[events[i].name].splice(index, 1)
      }
    }

    if (alls.length) {
      let a = [eventName].concat(args);
      this._executeListener(alls, a);
    }

    if (calls.length) this._executeListener(calls, args);

    return this;

  }

  /**
   * 
   * 
   * @param {Events[]} func
   * @param {any[]} [args]
   * 
   * @memberOf EventEmitter
   */
  _executeListener(func: Events[], args?: any[]) {
    EventEmitter.executeListenerFunction(func, args);
  }

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
  listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once: boolean = false): any {
    if (!isEventEmitter(obj)) {
      if (EventEmitter.throwOnError)
        throw new EventEmitterError("obj is not an EventEmitter", once ? "listenToOnce" : "listenTo", this, obj);
      return this;
    }

    let listeningTo, id, meth;
    listeningTo = this._listeningTo || (this._listeningTo = {});
    id = obj.listenId || (obj.listenId = getID())
    listeningTo[id] = obj;
    meth = once ? 'once' : 'on';

    obj[meth](event, fn, this);

    return this;
  }

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
  listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any {
    return this.listenTo(obj, event, fn, ctx, true)
  }

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
  stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler) {
    if (obj && !isEventEmitter(obj)) {
      if (EventEmitter.throwOnError)
        throw new EventEmitterError("obj is not an EventEmitter", "stopListening", this, obj);
      return this;
    }

    let listeningTo: any = this._listeningTo;
    if (!listeningTo) return this;
    var remove = !event && !callback;
    if (!callback && typeof event === 'object') callback = <any>this;
    if (obj) (listeningTo = {})[obj.listenId] = obj;

    for (var id in listeningTo) {
      obj = listeningTo[id];
      obj.off(event, callback, this);

      if (remove || !Object.keys(obj.listeners).length) delete this._listeningTo[id];
    }
    return this;
  }

  /**
   * 
   * 
   * 
   * @memberOf EventEmitter
   */
  destroy() {
    this.stopListening();
    this.off();
  }
}
