# super-event-emitter

[![npm version](https://badge.fury.io/js/super-event-emitter.svg)](https://badge.fury.io/js/super-event-emitter)
[![downloads count](https://img.shields.io/npm/dt/super-event-emitter.svg)](https://www.npmjs.com/~piecioshka)
[![dependencies](https://david-dm.org/piecioshka/super-event-emitter.svg)](https://github.com/piecioshka/super-event-emitter)
[![travis-ci](https://img.shields.io/travis/piecioshka/super-event-emitter.svg?maxAge=2592000)](https://travis-ci.org/piecioshka/super-event-emitter)
[![coveralls](https://coveralls.io/repos/github/piecioshka/super-event-emitter/badge.svg?branch=master)](https://coveralls.io/github/piecioshka/super-event-emitter?branch=master)
[![snyk](https://snyk.io/test/github/piecioshka/super-event-emitter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/piecioshka/super-event-emitter?targetFile=package.json)

:hammer: Lightweight and simple interpretation of popular event management / aggregation

## Article

I was created a blog post (in polish) about this tool:<br/>
<https://piecioshka.pl/blog/2016/01/29/narzedzia-swiata-super-event-emitter-js.html>

## Installation

```bash
npm install super-event-emitter
```

## Usage

```javascript
const EventEmitter = require('super-event-emitter');
// or
const { EventEmitter } = require('super-event-emitter');
```

### Demo #1 — Existed object

```javascript
var bar = {}; // Or any other object.
EventEmitter.mixin(bar);

bar.on('test', function () {
    console.log('triggered!');
}, this);

bar.emit('test');
```

### Demo #2 — ECMAScript 2015 (ES6) example

```javascript
class Person extends EventEmitter {
    say(message) {
        this.emit('say', message);
    }
}

const p1 = new Person();

p1.on('say', function (message) {
    console.log(message); // 'I love cookie'
});

p1.say('I love cookie');
```

Try to test this by: `node --harmony test.js`

## API

#### `on( name: string, fn: Function, ctx: Object )`

* `name` - a string value representing the name of event
* `fn` - action which will be called when event will be triggered
* `ctx` - object will be context of triggered action

Example:

```javascript
instance.on('foo', function (payload) {
    console.log(payload, this);
}, instance);
```

Special behavior:

* when `name` = `all` (or `*`) register handler will be fired on any event

```javascript
instance.on('all', function (name, payload) {
    // will be fired, when emit any of event type
    // - name - event name, in this example will be equal: "something"
    // - payload - data which are sended, in this example will be equal: { foo: 1 }
});

instance.emit('something', { foo: 1 });
```

#### `once( name: string, fn: Function, ctx: Object )`

The same as `on` but, after triggered event, destroy all listeners

Example:

```javascript
instance.once('foo', function (payload) {
    console.log(payload, this);
}, instance);
```

#### `off( name: string, fn: Function )`

* `name` - a string value representing the name of event
* `fn` - action which will be removed from listeners

Example:

```javascript
instance.off('foo', fooHandler);
```

#### `emit( name: string, params: Object )`

* `name` - a string value representing the name of event
* `params` - will be passed as first argument in called actions

Example:

```javascript
instance.emit('foo', { name: 'bar' });
```

## Backward compatibility

For compatibility with any other APIs I was added some **aliases**:

* `on` => `addEventListener`, `addListener`, `bind`
* `off` => `removeEventListener`, `removeListener`, `unbind`
* `emit` => `dispatchEventListener`, `dispatchListener`, `trigger`

## TypeScript Definitions

```bash
typings install github:piecioshka/super-event-emitter/typings.json -GD
```

## Unit tests

```bash
npm test
```

## Code coverage

```bash
npm run coverage
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2016
