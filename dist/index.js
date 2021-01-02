'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _getIterator = require("@babel/runtime-corejs3/core-js/get-iterator");

var _Array$isArray = require("@babel/runtime-corejs3/core-js-stable/array/is-array");

var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");

var _Symbol = require("@babel/runtime-corejs3/core-js-stable/symbol");

var _Array$from = require("@babel/runtime-corejs3/core-js-stable/array/from");

var _sliceInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/slice");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.string.split.js");

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _Symbol === "undefined" || _getIteratorMethod(o) == null) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = _getIterator(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context2; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty2(_context2 = Object.prototype.toString.call(o)).call(_context2, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Crypto = require('crypto');

var MIXED_TYPE = 0; // mixed password

var PURE_NUMBER_TYPE = 1; // pure number password

var MIN_LENGTH = 4; // min password length

var MAX_LENGTH = 36; // max password length

var SPECIAL_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

var PasswordGeneratorCore = /*#__PURE__*/function () {
  function PasswordGeneratorCore(_ref) {
    var params = (0, _assign.default)({}, _ref);
    (0, _classCallCheck2.default)(this, PasswordGeneratorCore);
    this.checkParams(params);
    var complex = this.getComplex(params);
    this.text = this.generate(complex.join(''), params);
  }

  (0, _createClass2.default)(PasswordGeneratorCore, [{
    key: "checkParams",
    value: function checkParams(params) {
      function checkPasswordType(params) {
        if (typeof params.passwordType != 'number') {
          throw new Error('passwordType value type error');
        }

        if (params.passwordType != MIXED_TYPE && params.passwordType != PURE_NUMBER_TYPE) {
          throw new Error('passwordType value range error');
        }
      }

      function checkPasswordLength(params) {
        if (typeof params.passwordLength != 'number') {
          throw new Error('passwordLength value type error');
        }

        if (params.passwordLength < MIN_LENGTH || params.passwordLength > MAX_LENGTH) {
          throw new Error('passwordLength value range error');
        }
      }

      function checkPublicKey(params) {
        if (typeof params.publicKey != 'string') {
          throw new Error('publicKey value type error');
        }
      }

      function checkPrivateKey(params) {
        if (typeof params.privateKey != 'string') {
          throw new Error('privateKey value type error');
        }
      }

      function checkTimestamp(params) {
        if (typeof params.timestamp != 'string') {
          throw new Error('timestamp value type error');
        }
      }

      if (!params.passwordType) {
        params.passwordType = MIXED_TYPE;
      }

      checkPasswordType(params);
      checkPasswordLength(params);
      checkPublicKey(params);
      checkPrivateKey(params);
      checkTimestamp(params);
    }
  }, {
    key: "hmacsha512",
    value: function hmacsha512() {
      var privateKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var publicKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var timestamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var hmac = Crypto.createHmac('sha512', privateKey);
      hmac.update(publicKey);
      hmac.update(timestamp);
      return hmac.digest('hex');
    }
  }, {
    key: "getOrigin",
    value: function getOrigin(raw, privateKey, timestamp) {
      return this.hmacsha512(raw, privateKey, timestamp).split('');
    }
  }, {
    key: "getRuler",
    value: function getRuler(raw, privateKey, timestamp) {
      return this.hmacsha512(privateKey, raw, timestamp).split('');
    }
  }, {
    key: "getComplex",
    value: function getComplex(params) {
      var raw = this.hmacsha512(params.privateKey, params.publicKey, params.timestamp);
      var origin = (0, _freeze.default)(this.getOrigin(raw, params.privateKey, params.timestamp));
      var ruler = (0, _freeze.default)(this.getRuler(raw, params.privateKey, params.timestamp));
      var complex = [];

      for (var _i = 0, _Object$entries = (0, _entries.default)(origin); _i < _Object$entries.length; _i++) {
        var item = _Object$entries[_i];

        if (!/\d/.test(item[1]) && !/\d/.test(ruler[item[0]])) {
          // uppercase those elements belong to the origin array when both elements are not number
          complex.push(item[1].toUpperCase());
        } else {
          complex.push(item[1]);
        }
      } // generate a char array which contains uppercase letters, lowercase letters and numbers


      return complex;
    }
  }, {
    key: "generate",
    value: function generate() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (params.passwordType == PURE_NUMBER_TYPE) {
        var _context;

        // pick up all numbers from the text string, then cut the first piece according to the required length
        return (0, _slice.default)(_context = text.match(/\d/g)).call(_context, 0, params.passwordLength).join('');
      } else {
        // determine whether the text string contains uppercase letters, lowercase letters and numbers, then cut into pieces according to the required length
        var result = text.match(new RegExp("(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{".concat(params.passwordLength, "}"), 'g'));

        try {
          var _iterator = _createForOfIteratorHelper(result),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;

              // find a element which meet the requirements from the result array
              var _result = new RegExp("(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])").test(item);

              if (_result) {
                // match all numbers
                var numberMatchResult = item.match(/\d/g); // match all lowercase letters

                var lLetterMatchResult = item.match(/[a-z]/g); // match all uppercase letters

                var uLetterMatchResult = item.match(/[A-Z]/g); // match a special symbol according to the first element belongs to the numberMatchResult array

                var replacement = SPECIAL_SYMBOLS[numberMatchResult[0]];

                if (numberMatchResult.length > lLetterMatchResult.length && numberMatchResult.length > uLetterMatchResult.length) {
                  // the most numerous chars are numbers, replace the first number with the special symbol
                  return item.replace(numberMatchResult[0], replacement);
                } else if (lLetterMatchResult.length > numberMatchResult.length && lLetterMatchResult.length > uLetterMatchResult.length) {
                  // the most numerous chars are lowercase letters, replace the first lowercase letter with the special symbol
                  return item.replace(lLetterMatchResult[0], replacement);
                } else {
                  // the most numerous chars are uppercase letters, replace the first uppercase letter with the special symbol
                  return item.replace(uLetterMatchResult[0], replacement);
                }
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } catch (error) {
          throw new Error('generate unsuccessfully');
        }
      }
    }
  }]);
  return PasswordGeneratorCore;
}();

module.exports = PasswordGeneratorCore;