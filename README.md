# event-emitter

> My own interpretation of event management.

## Usage

Empty object:

```
var foo = EventEmitter.mixin({});
foo.on('test', function () {
  console.log('triggered!');
});
foo.emit('test');
```

Existed object: 

```
EventEmitter.mixin(bar);
bar.on('test', function () {
  console.log('triggered!');
});
bar.emit('test');
```

## Docs

List of methods:

- `on` (name, fn, ctx)
    - `name` {string} - name of event
    - `fn` {Function} - action which will be called when event will be triggered
    - `ctx` {Object} - object will be context of triggered action
- `once` (The same as `on` but, after triggered event, destroy all listeners).
- `off` (name, fn)
    - `name` {string} - name of event
    - `fn` {Function} - action which will be removed from listeners
- `emit` (name, params)
    - `name` {string} - name of event
    - `params` {Object} - will be passed as first argument in called actions

## License

[The MIT License](http://piecioshka.mit-license.org)
