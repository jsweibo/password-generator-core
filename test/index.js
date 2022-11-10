const PasswordGeneratorCore = require('../dist/index.node.js');

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
