'use strict';
const Crypto = require('crypto');

const HYBRID_TYPE = 0; // eg: !01a3A
const ALPHABETIC_AND_DIGITAL_TYPE = 1; // eg: 001a3A
const ALPHABETIC_TYPE = 2; // eg: eaAeeB
const DIGITAL_TYPE = 3; // eg: 104730
const MIN_LENGTH = 4; // min password length
const MAX_LENGTH = 36; // max password length
const SPECIAL_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

class PasswordGeneratorCore {
  constructor({ ...params }) {
    this.checkParams(params);
    const complex = this.getComplex(params);
    this.text = this.generate(complex.join(''), params);
  }

  checkParams(params) {
    function checkPasswordType(params) {
      if (typeof params.passwordType != 'number') {
        throw new Error('passwordType must be number');
      }
      if (
        params.passwordType != HYBRID_TYPE &&
        params.passwordType != ALPHABETIC_AND_DIGITAL_TYPE &&
        params.passwordType != ALPHABETIC_TYPE &&
        params.passwordType != DIGITAL_TYPE
      ) {
        throw new Error('invalid passwordType');
      }
    }
    function checkPasswordLength(params) {
      if (typeof params.passwordLength != 'number') {
        throw new Error('passwordLength must be number');
      }
      if (
        params.passwordLength < MIN_LENGTH ||
        params.passwordLength > MAX_LENGTH
      ) {
        throw new Error('invalid passwordLength');
      }
    }
    function checkPublicKey(params) {
      if (typeof params.publicKey != 'string') {
        throw new Error('publicKey must be string');
      }
    }
    function checkPrivateKey(params) {
      if (typeof params.privateKey != 'string') {
        throw new Error('privateKey must be string');
      }
    }
    function checkTimestamp(params) {
      if (typeof params.timestamp != 'number') {
        throw new Error('timestamp must be number');
      }
    }
    if (!params.passwordType) {
      params.passwordType = HYBRID_TYPE;
    }
    checkPasswordType(params);
    checkPasswordLength(params);
    checkPublicKey(params);
    checkPrivateKey(params);
    checkTimestamp(params);
  }

  hmacsha512(privateKey, publicKey, timestamp) {
    const hmac = Crypto.createHmac('sha512', privateKey);
    hmac.update(publicKey);
    hmac.update(timestamp.toString());
    return hmac.digest('hex');
  }

  getOrigin(raw, privateKey, timestamp) {
    return this.hmacsha512(raw, privateKey, timestamp).split('');
  }

  getRuler(raw, privateKey, timestamp) {
    return this.hmacsha512(privateKey, raw, timestamp).split('');
  }

  getComplex(params) {
    const raw = this.hmacsha512(
      params.privateKey,
      params.publicKey,
      params.timestamp
    );
    const origin = Object.freeze(
      this.getOrigin(raw, params.privateKey, params.timestamp)
    );
    const ruler = Object.freeze(
      this.getRuler(raw, params.privateKey, params.timestamp)
    );
    const complex = [];
    for (const item of Object.entries(origin)) {
      if (!/\d/.test(item[1]) && !/\d/.test(ruler[item[0]])) {
        // uppercase those elements belong to the origin array when both elements are not number
        complex.push(item[1].toUpperCase());
      } else {
        complex.push(item[1]);
      }
    }
    // generate a char array which contains uppercase letters, lowercase letters and numbers
    return complex;
  }

  generate(text, params) {
    if (params.passwordType == DIGITAL_TYPE) {
      // pick up all numbers from the text string, then cut the first piece according to the required length
      return text.match(/\d/g).slice(0, params.passwordLength).join('');
    } else if (params.passwordType == ALPHABETIC_TYPE) {
      // pick up all alphabet from the text string, then cut the first piece according to the required length
      return text
        .match(/[a-zA-Z]/g)
        .slice(0, params.passwordLength)
        .join('');
    } else if (params.passwordType == ALPHABETIC_AND_DIGITAL_TYPE) {
      // determine whether the text string contains uppercase letters, lowercase letters and numbers, then cut into pieces according to the required length
      const result = text.match(
        new RegExp(
          `(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{${params.passwordLength}}`,
          'g'
        )
      );
      try {
        for (const item of result) {
          // find a element which meet the requirements from the result array
          let result = new RegExp(`(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])`).test(item);
          if (result) {
            return item;
          }
        }
      } catch (error) {
        throw new Error('generate unsuccessfully');
      }
    } else {
      // determine whether the text string contains uppercase letters, lowercase letters and numbers, then cut into pieces according to the required length
      const result = text.match(
        new RegExp(
          `(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{${params.passwordLength}}`,
          'g'
        )
      );
      try {
        for (const item of result) {
          // find a element which meet the requirements from the result array
          let result = new RegExp(`(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])`).test(item);
          if (result) {
            // match all numbers
            const numberMatchResult = item.match(/\d/g);
            // match all lowercase letters
            const lLetterMatchResult = item.match(/[a-z]/g);
            // match all uppercase letters
            const uLetterMatchResult = item.match(/[A-Z]/g);
            // match a special symbol according to the first element belongs to the numberMatchResult array
            const replacement = SPECIAL_SYMBOLS[numberMatchResult[0]];
            if (
              numberMatchResult.length > lLetterMatchResult.length &&
              numberMatchResult.length > uLetterMatchResult.length
            ) {
              // the most numerous chars are numbers, replace the first number with the special symbol
              return item.replace(numberMatchResult[0], replacement);
            } else if (
              lLetterMatchResult.length > numberMatchResult.length &&
              lLetterMatchResult.length > uLetterMatchResult.length
            ) {
              // the most numerous chars are lowercase letters, replace the first lowercase letter with the special symbol
              return item.replace(lLetterMatchResult[0], replacement);
            } else {
              // the most numerous chars are uppercase letters, replace the first uppercase letter with the special symbol
              return item.replace(uLetterMatchResult[0], replacement);
            }
          }
        }
      } catch (error) {
        throw new Error('generate unsuccessfully');
      }
    }
  }
}

module.exports = PasswordGeneratorCore;
