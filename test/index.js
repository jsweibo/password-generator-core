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
