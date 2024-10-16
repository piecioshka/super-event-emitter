# super-event-emitter

[![node version](https://img.shields.io/node/v/super-event-emitter.svg)](https://www.npmjs.com/package/super-event-emitter)
[![npm version](https://badge.fury.io/js/super-event-emitter.svg)](https://badge.fury.io/js/super-event-emitter)
[![downloads count](https://img.shields.io/npm/dt/super-event-emitter.svg)](https://www.npmjs.com/package/super-event-emitter)
[![license](https://img.shields.io/npm/l/super-event-emitter.svg)](https://piecioshka.mit-license.org)
[![github-ci](https://github.com/piecioshka/super-event-emitter/actions/workflows/testing.yml/badge.svg)](https://github.com/piecioshka/super-event-emitter/actions/workflows/testing.yml)

🔨 Lightweight and simple interpretation of popular event management / aggregation

## Motivation

I was created a blog post (in polish) about this tool:<br/>
<https://piecioshka.pl/blog/2016/01/29/narzedzia-swiata-super-event-emitter-js.html>

## Installation

```bash
npm install super-event-emitter
```

## Usage — CommonJS

```javascript
const EventEmitter = require('super-event-emitter');
// or
const { EventEmitter } = require('super-event-emitter');
```

## Usage — ECMAScript Modules (ex. in TypeScript world)

```ts
import { EventEmitter } from "super-event-emitter";
// or
// import EventEmitter from "super-event-emitter";

class Cart extends EventEmitter {
    addProduct(product: Product) {
        this.emit('cart:addProduct', { product });
    }
}
```

### Demo #1 — Typical object literal

<details>

```javascript
const bar = {};

EventEmitter.mixin(bar);

bar.on('test', function () {
    console.log('triggered!');
}, this);

bar.emit('test');
```

</details>

### Demo #2 — Class API from ECMAScript 2015

<details>

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

</details>

## Documentation

* [API](./docs/api.md)

## Unit tests

```bash
npm test
```

## Code coverage

```bash
npm run coverage
```

## License

[The MIT License](https://piecioshka.mit-license.org) @ 2016
