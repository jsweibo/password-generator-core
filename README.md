# @jsweibo/password-generator-core

![npm](https://img.shields.io/npm/v/@jsweibo/password-generator-core.svg)
![npm](https://img.shields.io/npm/dt/@jsweibo/password-generator-core.svg)
![npm](https://img.shields.io/npm/l/@jsweibo/password-generator-core.svg)

It can generate a unique password based on some information you provide

## Install

```bash
$ npm i @jsweibo/password-generator-core
```

## Example

```js
const PasswordGeneratorCore = require('@jsweibo/password-generator-core');

// generate HYBRID_TYPE password
console.log(
  new PasswordGeneratorCore({
    passwordLength: 6,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: 1577836800000,
  }).text
); // !01a3A

// generate ALPHABETIC_AND_DIGITAL_TYPE password
console.log(
  new PasswordGeneratorCore({
    passwordType: 1,
    passwordLength: 6,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: 1577836800000,
  }).text
); // 001a3A

// generate ALPHABETIC_TYPE password
console.log(
  new PasswordGeneratorCore({
    passwordType: 2,
    passwordLength: 6,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: 1577836800000,
  }).text
); // eaAeeB

// generate DIGITAL_TYPE password
console.log(
  new PasswordGeneratorCore({
    passwordType: 3,
    passwordLength: 6,
    publicKey: 'example.com',
    privateKey: 'example',
    timestamp: 1577836800000,
  }).text
); // 104730
```

## options

### `passwordType`

- variable type: `Number`
- default value: `0`

| value | meaning                     | example |
| ----- | --------------------------- | ------- |
| 0     | HYBRID_TYPE                 | !01a3A  |
| 1     | ALPHABETIC_AND_DIGITAL_TYPE | 001a3A  |
| 2     | ALPHABETIC_TYPE             | eaAeeB  |
| 3     | DIGITAL_TYPE                | 104730  |

### `passwordLength`

- variable type: `Number`
- required

### `publicKey`

- variable type: `String`
- required

### `privateKey`

- variable type: `String`
- required

### `timestamp`

- variable type: `Number`
- required

## license

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present jsweibo
