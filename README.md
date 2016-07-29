# super-event-emitter

[![npm version](https://badge.fury.io/js/super-event-emitter.svg)](https://badge.fury.io/js/super-event-emitter)
![](https://img.shields.io/npm/dt/super-event-emitter.svg)
[![Travis](https://img.shields.io/travis/piecioshka/super-event-emitter.svg?maxAge=2592000)](https://travis-ci.org/piecioshka/super-event-emitter)

> Super small (2KB) and simple interpretation of popular event management / aggregation.

I was created a blog post (in polish) about this tool: http://piecioshka.pl/blog/2016/01/29/super-event-emitter.html

## Install

```
$ npm install super-event-emitter
```

## Usage

Simple literal object:

```javascript
var foo = EventEmitter.mixin({});

foo.on('test', function () {
    console.log('triggered!');
}, this);

foo.emit('test');
```

Existed object: 

```javascript
var bar = {}; // Or any other object.
EventEmitter.mixin(bar);

bar.on('test', function () {
    console.log('triggered!');
}, this);

bar.emit('test');
```

ECMAScript 6 example:

```javascript
// File: test.js
class Person {
    constructor() {
        EventEmitter.mixin(this);
    }
    
    say(message) {
        this.emit('say', message);
    }
}

// In some cases we have an error:
// SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
// so use `var` statement.
var p1 = new Person();

p1.on('say', function (message) {
    console.log(message);
});

p1.say('cookie');
```

Try to test this by: `node --harmony test.js`

## API

#### `on( name: string, fn: Function, ctx: Object )`

 * `name` - a string value representing the name of event
 * `fn` - action which will be called when event will be triggered
 * `ctx` - object will be context of triggered action

Example usage:

```javascript
instance.on('foo', function (payload) {
    console.log(payload, this);
}, instance);
```

Specials:

* when set as `name` value `all` handler will be fired in any event

```javascript
instance.on('all', function (name, payload) {
    // will be fired, when emit any of event type
    // - name - event name, in this example will be equal: "something"
    // - payload - data which are sended, in this example will be equal: { foo: 1 }
});

instance.emit('something', { foo: 1 });
```


#### `once( name: string, fn: Function, ctx: Object )` - The same as `on` but, after triggered event, destroy all listeners

Example usage:

```javascript
instance.once('foo', function (payload) {
    console.log(payload, this);
}, instance);
```

#### `off( name: string, fn: Function )`

 * `name` - a string value representing the name of event
 * `fn` - action which will be removed from listeners
 
Example usage:

```javascript
instance.off('foo', fooHandler);
```

#### `emit( name: string, params: Object )`

 * `name` - a string value representing the name of event
 * `params` - will be passed as first argument in called actions

Example usage:

```javascript
instance.emit('foo', { name: 'bar' });
```

---

For compatibility with any other APIs I was added some **aliases**:

 * `on` => `addEventListener`, `addListener`, `bind`
 * `off` => `removeEventListener`, `removeListener`, `unbind`
 * `emit` => `trigger`

## Unit tests

How to run unit test (written in Jasmine):

```
$ npm test
```

## Code coverage

Use Istanbul to get code coverage ratio.

```
$ npm run coverage
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2016
