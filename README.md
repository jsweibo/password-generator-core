# @jsweibo/password-generator-core

![npm](https://img.shields.io/npm/v/@jsweibo/password-generator-core.svg)
![npm](https://img.shields.io/npm/dt/@jsweibo/password-generator-core.svg)
![npm](https://img.shields.io/npm/l/@jsweibo/password-generator-core.svg)

It generates password based on public key and private key.

## Install

```bash
$ npm i @jsweibo/password-generator-core
```

## Example

```js
const PasswordGeneratorCore = require('../dist/index.js');

// generate mixed password
console.log(
  new PasswordGeneratorCore({
    passwordLength: 16,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: '1577836800000',
  }).text
); // @047e3001a3A6e15

// generate pure number password
console.log(
  new PasswordGeneratorCore({
    passwordType: 1,
    passwordLength: 16,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: '1577836800000',
  }).text
); // 1047300136159963
```

## license

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present jsweibo
