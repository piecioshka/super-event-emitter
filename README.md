# super-event-emitter

[![npm version](https://badge.fury.io/js/super-event-emitter.svg)](https://badge.fury.io/js/super-event-emitter)

> Super small and simple interpretation of popular event management.

I was create blog post (in polish language) about this tool: http://piecioshka.pl/blog/2016/01/29/super-event-emitter.html

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

## API

## `on` (`name`, `fn`, `ctx`)

 * `name` {string} - name of event
 * `fn` {Function} - action which will be called when event will be triggered
 * `ctx` {Object} - object will be context of triggered action
 
### `once` (The same as `on` but, after triggered event, destroy all listeners).

### `off` (`name`, `fn`)

 * `name` {string} - name of event
 * `fn` {Function} - action which will be removed from listeners
 
### `emit` (`name`, `params`)

 * `name` {string} - name of event
 * `params` {Object} - will be passed as first argument in called actions

In some reasons (compatibility with any other APIs) I add some **aliases**:
 
 * `on` = `addEventListener`, `addListener`
 * `off` = `removeEventListener`, `removeListener`
 * `emit` = `trigger`

## Unit test

How to run unit test (written in Jasmine):

```
npm test
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2016
