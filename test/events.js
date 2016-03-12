'use strict';

require('should');

const EventEmitter = require('../lib/events').EventEmitter;
const sinon = require('sinon');

describe('EventEmitter', function () {
  
  beforeEach(function () {
    this.emitter = new EventEmitter();
  });
  
  it('should trigger event', function () {
    let callback = sinon.spy();
    this.emitter.on('event', callback);
    for (let i = 0; i < 10; i++) {
      this.emitter.trigger('event', 'args');
    }
    callback.callCount.should.equal(10);
    callback.calledOn(this.emitter).should.equal(true);
    callback.calledWith('args').should.equal(true)
    
  });
  
  it('should trigger with specified context', function () {
    let callback = sinon.spy();
    let ctx = {};
    this.emitter.on('event', callback, ctx);
    for (let i = 0; i < 10; i++) {
      this.emitter.trigger('event', 'args');
    }
    callback.callCount.should.equal(10);
    callback.calledOn(ctx).should.equal(true);
    callback.calledWith('args').should.equal(true)
  });

  it('should listenTo', function () {

    let callback = sinon.spy();

    let e = new EventEmitter();

    this.emitter.listenTo(e, 'click', callback);

    e.trigger('click');
    e.trigger('click');

    callback.callCount.should.equal(2);


  })
  
});