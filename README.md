# super-event-emitter

[![npm version](https://badge.fury.io/js/super-event-emitter.svg)](https://badge.fury.io/js/super-event-emitter)

> Super small and simple interpretation of popular event management / aggregation.

I was created a blog post (in polish language) about this tool: http://piecioshka.pl/blog/2016/01/29/super-event-emitter.html

## Install

```
npm install super-event-emitter
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

#### `on( name, fn, ctx )`

 * `name` - a string value representing the name of event
 * `fn` - action which will be called when event will be triggered
 * `ctx` - object will be context of triggered action

Example usage:

```javascript
instance.on('foo', function (data) {
    console.log(data, this);
}, instance);
```

Specials:

* when set as `name` value `all` handler will be fired in any event

```javascript
instance.on('all', function (data) {
    // will be fired, when emit any of event type
});

instance.emit('something');
```


#### `once( name, fn, ctx )` - The same as `on` but, after triggered event, destroy all listeners

Example usage:

```javascript
instance.once('foo', function (data) {
    console.log(data, this);
}, instance);
```

#### `off( name, fn )`

 * `name` - a string value representing the name of event
 * `fn` - action which will be removed from listeners
 
Example usage:

```javascript
instance.off('foo', fooHandler);
```

#### `emit( name, params )`

 * `name` - a string value representing the name of event
 * `params` - will be passed as first argument in called actions

Example usage:

```javascript
instance.emit('foo', { name: 'bar' });
```

---

For compatibility with any other APIs I was added some **aliases**:

 * `on` => `addEventListener`, `addListener`
 * `off` => `removeEventListener`, `removeListener`
 * `emit` => `trigger`

## Unit test

How to run unit test (written in Jasmine):

```
npm test
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2016
