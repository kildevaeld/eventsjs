(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["eventsjs"] = factory();
	else
		root["eventsjs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var idCounter = 0;
	function getID() {
	    return "" + (++idCounter);
	}
	/**
	 *
	 *
	 * @export
	 * @class EventEmitterError
	 * @extends {Error}
	 */
	var EventEmitterError = (function (_super) {
	    __extends(EventEmitterError, _super);
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
	    function EventEmitterError(message, method, klass, ctx) {
	        _super.call(this, message);
	        this.message = message;
	        this.method = method;
	        this.klass = klass;
	        this.ctx = ctx;
	    }
	    /**
	     *
	     *
	     * @returns
	     *
	     * @memberOf EventEmitterError
	     */
	    EventEmitterError.prototype.toString = function () {
	        var prefix = "EventEmitterError";
	        if (this.method && this.method != "") {
	            prefix = "EventEmitter#" + this.method;
	        }
	        return prefix + ": " + this.message;
	    };
	    return EventEmitterError;
	}(Error));
	exports.EventEmitterError = EventEmitterError;
	/**
	 *
	 *
	 * @export
	 * @param {Events[]} fn
	 * @param {any[]} [args=[]]
	 * @returns
	 */
	function callFunc(fn, args) {
	    if (args === void 0) { args = []; }
	    var l = fn.length, i = -1, a1 = args[0], a2 = args[1], a3 = args[2], a4 = args[3];
	    switch (args.length) {
	        case 0:
	            while (++i < l)
	                fn[i].handler.call(fn[i].ctx);
	            return;
	        case 1:
	            while (++i < l)
	                fn[i].handler.call(fn[i].ctx, a1);
	            return;
	        case 2:
	            while (++i < l)
	                fn[i].handler.call(fn[i].ctx, a1, a2);
	            return;
	        case 3:
	            while (++i < l)
	                fn[i].handler.call(fn[i].ctx, a1, a2, a3);
	            return;
	        case 4:
	            while (++i < l)
	                fn[i].handler.call(fn[i].ctx, a1, a2, a3, a4);
	            return;
	        default:
	            while (++i < l)
	                fn[i].handler.apply(fn[i].ctx, args);
	            return;
	    }
	}
	exports.callFunc = callFunc;
	/**
	 *
	 *
	 * @export
	 * @param {*} a
	 * @returns {a is Function}
	 */
	function isFunction(a) {
	    return typeof a === 'function';
	}
	exports.isFunction = isFunction;
	/**
	 *
	 *
	 * @export
	 * @param {*} a
	 * @returns {a is EventEmitter}
	 */
	function isEventEmitter(a) {
	    return a && (a instanceof EventEmitter || (isFunction(a.on) && isFunction(a.once) && isFunction(a.off) && isFunction(a.trigger)));
	}
	exports.isEventEmitter = isEventEmitter;
	/**
	 *
	 *
	 * @export
	 * @class EventEmitter
	 * @implements {IEventEmitter}
	 * @implements {Destroyable}
	 */
	var EventEmitter = (function () {
	    function EventEmitter() {
	    }
	    Object.defineProperty(EventEmitter.prototype, "listeners", {
	        /**
	         *
	         *
	         * @readonly
	         * @type {{ [key: string]: Events[] }}
	         * @memberOf EventEmitter
	         */
	        get: function () {
	            return this._listeners;
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	    EventEmitter.prototype.on = function (event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        var events = (this._listeners || (this._listeners = {}))[event] || (this._listeners[event] = []);
	        events.push({
	            name: event,
	            once: once,
	            handler: fn,
	            ctx: ctx || this
	        });
	        return this;
	    };
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
	    EventEmitter.prototype.once = function (event, fn, ctx) {
	        return this.on(event, fn, ctx, true);
	    };
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
	    EventEmitter.prototype.off = function (eventName, fn, ctx) {
	        this._listeners = this._listeners || {};
	        if (eventName == null && ctx == null) {
	            this._listeners = {};
	        }
	        else if (this._listeners[eventName]) {
	            var events = this._listeners[eventName];
	            if (fn == null && ctx == null) {
	                this._listeners[eventName] = [];
	            }
	            else {
	                for (var i = 0; i < events.length; i++) {
	                    var e = events[i];
	                    if ((fn == null && ctx != null && e.ctx === ctx) ||
	                        (fn != null && ctx == null && e.handler === fn) ||
	                        (fn != null && ctx != null && e.handler === fn && e.ctx === ctx))
	                        //if (events[i].handler == fn) {
	                        this._listeners[eventName].splice(i, 1);
	                }
	            }
	        }
	        return this;
	    };
	    /**
	     *
	     *
	     * @param {string} eventName
	     * @param {...any[]} args
	     * @returns {*}
	     *
	     * @memberOf EventEmitter
	     */
	    EventEmitter.prototype.trigger = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        this._listeners = this._listeners || {};
	        var events = (this._listeners[eventName] || []).concat(this._listeners['all'] || []).concat(this._listeners["*"] || []);
	        if (EventEmitter.debugCallback)
	            EventEmitter.debugCallback(this.constructor.name, this.name, eventName, args, events);
	        var event, a, index;
	        var calls = [];
	        var alls = [];
	        for (var i = 0, ii = events.length; i < ii; i++) {
	            event = events[i];
	            a = args;
	            if (events[i].name == 'all' || events[i].name == '*') {
	                alls.push(events[i]);
	            }
	            else {
	                calls.push(events[i]);
	            }
	            if (events[i].once === true) {
	                index = this._listeners[events[i].name].indexOf(events[i]);
	                this._listeners[events[i].name].splice(index, 1);
	            }
	        }
	        if (alls.length) {
	            var a_1 = [eventName].concat(args);
	            this._executeListener(alls, a_1);
	        }
	        if (calls.length)
	            this._executeListener(calls, args);
	        return this;
	    };
	    /**
	     *
	     *
	     * @param {Events[]} func
	     * @param {any[]} [args]
	     *
	     * @memberOf EventEmitter
	     */
	    EventEmitter.prototype._executeListener = function (func, args) {
	        EventEmitter.executeListenerFunction(func, args);
	    };
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
	    EventEmitter.prototype.listenTo = function (obj, event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        if (!isEventEmitter(obj)) {
	            if (EventEmitter.throwOnError)
	                throw new EventEmitterError("obj is not an EventEmitter", once ? "listenToOnce" : "listenTo", this, obj);
	            return this;
	        }
	        var listeningTo, id, meth;
	        listeningTo = this._listeningTo || (this._listeningTo = {});
	        id = obj.listenId || (obj.listenId = getID());
	        listeningTo[id] = obj;
	        meth = once ? 'once' : 'on';
	        obj[meth](event, fn, this);
	        return this;
	    };
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
	    EventEmitter.prototype.listenToOnce = function (obj, event, fn, ctx) {
	        return this.listenTo(obj, event, fn, ctx, true);
	    };
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
	    EventEmitter.prototype.stopListening = function (obj, event, callback) {
	        if (obj && !isEventEmitter(obj)) {
	            if (EventEmitter.throwOnError)
	                throw new EventEmitterError("obj is not an EventEmitter", "stopListening", this, obj);
	            return this;
	        }
	        var listeningTo = this._listeningTo;
	        if (!listeningTo)
	            return this;
	        var remove = !event && !callback;
	        if (!callback && typeof event === 'object')
	            callback = this;
	        if (obj)
	            (listeningTo = {})[obj.listenId] = obj;
	        for (var id in listeningTo) {
	            obj = listeningTo[id];
	            obj.off(event, callback, this);
	            if (remove || !Object.keys(obj.listeners).length)
	                delete this._listeningTo[id];
	        }
	        return this;
	    };
	    /**
	     *
	     *
	     *
	     * @memberOf EventEmitter
	     */
	    EventEmitter.prototype.destroy = function () {
	        this.stopListening();
	        this.off();
	    };
	    /**
	     *
	     *
	     * @static
	     * @type {boolean}
	     * @memberOf EventEmitter
	     */
	    EventEmitter.throwOnError = true;
	    /**
	     *
	     *
	     * @static
	     *
	     * @memberOf EventEmitter
	     */
	    EventEmitter.executeListenerFunction = function (func, args) {
	        callFunc(func, args);
	    };
	    return EventEmitter;
	}());
	exports.EventEmitter = EventEmitter;


/***/ }
/******/ ])
});
;