# API

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
