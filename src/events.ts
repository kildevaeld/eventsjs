
var idCounter = 0
function getID (): string {
  return "" + (++idCounter)
}

export class EventEmitterError extends Error {
	constructor(public message?: string, public method?:string, public ctx?: any) {
		super(message);
	}

	toString() {
		let prefix = "EventEmitterError";
		if (this.method && this.method != "") {
			prefix = `EventEmitter#${this.method}`;
		}
		return `${prefix}: ${this.message}`;
	}
}

export interface EventHandler {
  (...args: any[])
}

export interface Events {
  name: string
  once: boolean
  handler: EventHandler
  ctx?: any
}

export interface IEventEmitter {
  listeners: {[key: string]: Events[]}
  listenId?: string
  on (event: string, fn:EventHandler, ctx?:any): any
  once(event: string, fn:EventHandler, ctx?:any): any
  off (event: string, fn?:EventHandler, ctx?:any): any
  trigger (event: string, ...args:any[]): any
}

export interface Destroyable {
  destroy()
}

export function callFunc (fn:Events[], args:any[] = []) {
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

export function isFunction (a:any): a is Function {
  return typeof a === 'function';
}

export function isEventEmitter(a:any): a is EventEmitter {
  return a && (a instanceof EventEmitter || (isFunction(a.on) && isFunction(a.once) && isFunction(a.off) && isFunction(a.trigger)));
}


export class EventEmitter implements IEventEmitter, Destroyable {
  static debugCallback: (className: string, name: string, event: string, args: any[], listeners: Events[]) => void
  static executeListenerFunction: (func:Events[], args?: any[]) => void = function (func, args) {
  	callFunc(func, args);
  }

  listenId: string
  private _listeners: { [key: string]: Events[] }
  private _listeningTo: { [key: string]: any }

  public get listeners (): {[key: string]: Events[]} {
    return this._listeners;
  }

  on (event: string, fn:EventHandler, ctx?:any, once:boolean = false): any {
    let events = (this._listeners|| (this._listeners = {}))[event]||(this._listeners[event]=[]);

    events.push({
      name: event,
      once: once,
      handler: fn,
      ctx: ctx||this
    });

    return this
  }

  once (event: string, fn:EventHandler, ctx?:any): any {
    return this.on(event, fn, ctx, true);
  }

  off (eventName?: string, fn?:EventHandler): any {
      this._listeners = this._listeners || {};
    if (eventName == null) {
      this._listeners = {};
    } else if (this._listeners[eventName]){
      let events = this._listeners[eventName];
      if (fn == null) {
        this._listeners[eventName] = [];
      } else {
        for (let i=0;i<events.length;i++) {
          let event = events[i];
          if (events[i].handler == fn) {
            this._listeners[eventName].splice(i,1);
          }
        }
      }

    }

  }

  trigger (eventName: string, ...args:any[]): any {
    
    this._listeners = this._listeners || {};
    let events = (this._listeners[eventName] || []).concat(this._listeners['all'] || []).concat(this._listeners["*"] || []);


    if (EventEmitter.debugCallback)
      EventEmitter.debugCallback((<any>this.constructor).name, (<any>this).name, eventName, args, events)

    let event, a, len = events.length, index;
    let calls: Events[] = [];
    let alls: Events[] = [];

    for (let i=0, ii = events.length;i<ii;i++) {
      event = events[i]
      a = args

      if (events[i].name == 'all' || events[i].name == '*') {
        alls.push(events[i]);
      } else {
        calls.push(events[i]);
      }

      if (events[i].once === true) {
        index = this._listeners[events[i].name].indexOf(events[i])
        this._listeners[events[i].name].splice(index,1)
      }
    }

    if (alls.length) {
    	let a = [eventName].concat(args);
    	this._executeListener(alls, a);
    }

    if (calls.length) this._executeListener(calls, args);

    return this;

  }

  _executeListener(func: Events[], args?: any[]) {
      EventEmitter.executeListenerFunction(func, args);
  }

  listenTo (obj: IEventEmitter, event: string, fn:EventHandler, ctx?:any, once:boolean = false): any {
  	  if (!isEventEmitter(obj)) {
  	  	throw new EventEmitterError("obj is not an EventEmitter", once ? "listenToOnce" : "listenTo", obj);
  	  }

      let listeningTo, id, meth;
      listeningTo = this._listeningTo|| (this._listeningTo = {});
      id = obj.listenId || (obj.listenId = getID())
      listeningTo[id] = obj;
      meth = once ? 'once' : 'on';

      obj[meth](event, fn, this);

      return this;
  }

  listenToOnce (obj: IEventEmitter, event: string, fn:EventHandler, ctx?:any): any {
    return this.listenTo(obj, event, fn, ctx, true)
  }

  stopListening (obj?: IEventEmitter, event?:string, callback?:EventHandler) {
  	  if (!isEventEmitter(obj)) {
  	  	throw new EventEmitterError("obj is not an EventEmitter", "stopListening", obj);
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

  destroy () {
    this.stopListening();
    this.off();
  }
}
