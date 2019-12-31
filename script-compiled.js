"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImage = isImage;
exports.getFileExt = getFileExt;
exports.checkFileExtensions = checkFileExtensions;
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// To Match the string like: [tets=132], [Test1<=132]
var matchArrayKey = /^\[+([0-9a-z]+)+([\=\>\<]+)+(.+)\]$/i;
var _default = {
  getObjectFromArray: function getObjectFromArray(obj, prop) {
    var arrayKey = prop.match(matchArrayKey);

    if (arrayKey && this.isArray(obj)) {
      var key = arrayKey[1];
      var operator = arrayKey[2];
      var value = arrayKey[3];
      var item = null;
      obj.every(function (itm) {
        if (itm[key] !== undefined) {
          var val = itm[key].toString();

          if (operator === '=' && val == value || operator === '>=' && val >= value || operator === '>' && val > value || operator === '<' && val < value || operator === '<=' && val <= value || operator === '<>' && val != value) {
            item = itm;
            return false;
          } else {
            return true;
          }
        }

        return true;
      });
      return item;
    }

    return null;
  },

  /*
   |----------------------------------------------
   | To get the value of key from the given object
   |----------------------------------------------
   * @param obj => Object
   * @param props => String, Array, [Object key path],
   * @param defaultValue => Any, If the key does not exists in object then return the default value.
   */
  getProp: function getProp(obj, props, defaultValue) {
    props = typeof props === "string" ? props.split('.') : props;
    var prop = props.shift();

    var _obj_in_array = this.getObjectFromArray(obj, prop);

    if (_obj_in_array !== null) {
      obj = _obj_in_array;
      prop = props.shift();
    }

    if (!obj || obj[prop] === undefined || !props.length) {
      return !obj || obj[prop] === undefined ? defaultValue : obj[prop];
    }

    return this.getProp(obj[prop], props, defaultValue);
  },

  /*
   |------------------------------------------------
   | To delete the key from the given object
   |-----------------------------------------------
   * @param obj => Object
   * @param props => String, Array, [Object key path],
   */
  deleteProp: function deleteProp(obj, props) {
    var _this = this;

    props = typeof props === "string" ? props.split('.') : props;
    var prop = props.shift();

    if (!obj[prop] && prop !== '*') {
      return;
    }

    if (prop === '*') {
      obj.map(function (val, index) {
        _this.deleteProp(obj, [index].concat(props));
      });
    } else {
      if (props.length === 1 && this.isInteger(props[0])) {
        obj[prop].splice(parseInt(props[0]), 1);
        return;
      } else if (!props.length) {
        _vue.default.delete(obj, prop);

        return;
      }

      this.deleteProp(obj[prop], props);
    }
  },

  /*
   |----------------------------------------------
   | To set the value of key in the given object
   |----------------------------------------------
   * @param obj => Object
   * @param props => String, Array, [Object key path],
   * @param value => Any, [key value]
   */
  setProp: function setProp(obj, props, value, replace) {
    props = typeof props === "string" ? props.split('.') : props;
    replace = replace === undefined ? false : replace;
    var prop = props.shift();

    if (!obj[prop]) {
      _vue.default.set(obj, prop, props.length >= 1 && this.isInteger(props[0]) ? [] : {});
    }

    if (!props.length) {
      if (this.isObject(value) && replace === false) {
        var preValue = obj[prop] ? obj[prop] : {};

        _vue.default.set(obj, prop, _objectSpread({}, preValue, {}, value));
      } else {
        _vue.default.set(obj, prop, value);
      }

      return;
    }

    this.setProp(obj[prop], props, value, replace);
  },

  /*
   |----------------------------------------------
   | To push the value into the Array
   |----------------------------------------------
   * @param obj => Object
   * @param props => String, Array, [Object key path],
   * @param value => Array | Object | String,
   * @param listUniqueKeyName => String, If you want to check the unique object before adding.
   */
  pushProp: function pushProp(obj, props, value, listUniqueKeyName, updateIfExists) {
    props = typeof props === "string" ? props.split('.') : props; // Convert the value into Array

    value = !this.isArray(value) ? [value] : value; //console.log('pushProp',props, value)

    var prop = props.shift();

    if (!obj[prop]) {
      //console.log('Testing....', prop, props, ( (props.length >= 1  && this.isInteger(props[0]) || props.length ===0 ) ? [] : {}))
      _vue.default.set(obj, prop, props.length >= 1 && this.isInteger(props[0]) || props.length === 0 ? [] : {});
    }

    if (!props.length) {
      if (obj[prop] !== undefined) {
        var items = obj[prop];
        var first_items = items.slice();
        var max_length = first_items.length;
        value.forEach(function (v, index) {
          var isAlreadyPresent = null;

          if (listUniqueKeyName) {
            first_items.forEach(function (fi, _index) {
              if (fi[listUniqueKeyName] == v[listUniqueKeyName]) {
                isAlreadyPresent = true;

                if (updateIfExists) {
                  _vue.default.set(items, _index, _objectSpread({}, fi, {}, v));
                }
              }
            });
          }

          if (isAlreadyPresent === null) {
            _vue.default.set(items, max_length++, v);
          }
        });
      } else {
        _vue.default.set(obj, prop, value);
      }

      return;
    }

    this.pushProp(obj[prop], props, value, listUniqueKeyName, updateIfExists);
  },

  /*
   |----------------------------------------------
   | To unshift the value into the Array
   |----------------------------------------------
   * @param obj => Object
   * @param props => String, Array, [Object key path],
   * @param value => Array | Object | String,
   * @param listUniqueKeyName => String, If you want to check the unique object before adding.
   */
  unshiftProp: function unshiftProp(obj, props, value, listUniqueKeyName, updateIfExists) {
    props = typeof props === "string" ? props.split('.') : props; // Convert the value into Array

    value = !this.isArray(value) ? [value] : value;
    var prop = props.shift();

    if (!obj[prop]) {
      _vue.default.set(obj, prop, props.length >= 1 && this.isInteger(props[0]) || props.length === 0 ? [] : {});
    }

    if (!props.length) {
      if (obj[prop] !== undefined) {
        var items = obj[prop]; // Storeing the items which were present before updating..

        var first_items = _extends([], items); // let max_length = items.length;


        value.forEach(function (v, index) {
          var isAlreadyPresent = null;

          if (listUniqueKeyName) {
            first_items.forEach(function (fi, _index) {
              if (fi[listUniqueKeyName] == v[listUniqueKeyName]) {
                isAlreadyPresent = true;

                if (updateIfExists) {
                  _vue.default.set(items, _index, _objectSpread({}, fi, {}, v));
                }
              }
            });
          }

          if (isAlreadyPresent === null) {
            items.unshift(v);
          }
        });
      } else {
        _vue.default.set(obj, prop, value);
      }

      return;
    }

    this.unshiftProp(obj[prop], props, value, listUniqueKeyName, updateIfExists);
  },

  /*
   |------------------
   | To check the given object'constructor is array or not
   |-----------------------------------------
   * @param value => Object
   */
  isArray: function isArray(value) {
    return !!value && _typeof(value) === 'object' && value.constructor === Array;
  },

  /*
   |------------------
   | To check the given object'constructor is Object or not
   |-----------------------------------------
   * @param value => Object
   */
  isObject: function isObject(value) {
    return !!value && _typeof(value) === 'object' && value.constructor === Object;
  },
  isEmptyObject: function isEmptyObject(value) {
    return !this.isObject(value) || Object.keys(value).length === 0;
  },

  /*
   |------------------
   | To check the given string contains only number or not
   |-----------------------------------------
   * @param value => String
   */
  isInteger: function isInteger(value) {
    var regex = new RegExp(/^[0-9]+$/);
    return regex.test(value);
  },

  /*
   |------------------
   | To check the given string contains a valid float number
   |-----------------------------------------
   * @param value => String
   */
  isFloat: function isFloat(value) {
    var regex = new RegExp(/^-?\d*(\.\d+)$/);
    return regex.test(value);
  },

  /**
  * Covert Query string to Object
  */
  queryStringToObject: function queryStringToObject(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);

      if (key.indexOf('[') !== -1) {
        key = key.split('[').join('.').split(']').join('.').split('..').join('.');
        var lastIndex = key.lastIndexOf('.');

        if (lastIndex !== -1) {
          key = key.substr(0, lastIndex);
          this.setProp(params, key, value);
        }
      } else {
        params[key] = value;
      }
    }

    return params;
  },

  /**
  * Convert Query Object to Query String
  * @param obj 
  * @param prefix 
  */
  objectToQueryString: function objectToQueryString(obj, prefix) {
    var str = [],
        p;

    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
        str.push(v !== null && _typeof(v) === "object" ? this.objectToQueryString(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v ? v : ''));
      }
    }

    return str.join("&");
  },

  /**
   * To Convert the Object into formData.
   * @param {Object} obj 
   * @param {FormData} form 
   * @param {String} namespace 
   */
  objectToFormData: function objectToFormData(obj, form, namespace) {
    var fd = form || new FormData();
    var formKey;

    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        } // if the property is an object, but not a File, use recursivity.


        if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        } else if (_typeof(obj[property]) === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof Blob)) {
          this.objectToFormData(obj[property], fd, formKey);
        } else {
          // if it's a string or a File object
          if (obj[property] instanceof Blob && obj[property]) {
            fd.append(formKey, obj[property], obj[property].name);
          } else if (obj[property]) {
            fd.append(formKey, obj[property]);
          }
        }
      }
    }

    return fd;
  },

  /**
   * This function mostly use to rearrange the  object's index base on the delete element
   * @param obj => Object
   * @param elementName => element name which is going to delete.
   */
  reArrangeObjectIndex: function reArrangeObjectIndex(obj, elementName) {
    var errors = JSON.parse(JSON.stringify(obj));
    var errorKeys = Object.keys(errors);
    var hasChangedInError = false;
    var elementArr = elementName.split('.');
    var elementLastIndex = elementArr[elementArr.length - 1];
    var isLastIndexInteger = this.isInteger(elementLastIndex);
    var lastIndex = isLastIndexInteger ? parseInt(elementLastIndex) : null;
    var elementPath = elementArr.slice(0, -1).join('.');
    var regex = new RegExp("(" + elementPath + ".)+[0-9]+");
    errorKeys.forEach(function (item) {
      // If the Parent Element's error is deleting then deleting all the child element errors also.
      // If the element contains the number in end of name then search the child element index and process to deleting.
      if (item.indexOf(elementName) === 0) {
        delete errors[item];
        hasChangedInError = true;
      } //if deleting the Array element's Error then reArrange the errors indexing..


      var elementNextIndex = regex.exec(item);

      if (lastIndex !== null && elementNextIndex) {
        var elValueWithIndex = elementNextIndex[1];
        var elementNameWithKey = elementNextIndex[0];
        elementNextIndex[0].replace(elValueWithIndex, '');
        elementNextIndex = parseInt(elementNextIndex[0].replace(elementNextIndex[1], ''));

        if (elementNextIndex > lastIndex) {
          var newIndex = elementNextIndex - 1;
          var oldIndexVal = errors[item];
          var newItemIndex = item.replace(elementNameWithKey, elValueWithIndex + newIndex);
          delete errors[item];
          errors[newItemIndex] = oldIndexVal;
          hasChangedInError = true;
        }
      }
    });
    return hasChangedInError ? errors : null;
  }
};
/**
 * To the check the select file is an image.
 * @param {String} dataURL 
 */

exports.default = _default;

function isImage(dataURL) {
  try {
    var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
    return !!mimeType.match('image.*');
  } catch (e) {
    return false;
  }
}
/**
 * To get the file extension.
 * @param {String} name 
 */


function getFileExt(name) {
  var name_arr = name.split('.');
  return name_arr[name_arr.length - 1];
}
/**
 * To verify the file Extensions 
 * @param {Array} acceptedFiles 
 * @param {File Instance} file 
 */


function checkFileExtensions(acceptedFiles, file) {
  var fileName = file.name;
  var fileType = file.type;
  var is_valid = false;
  acceptedFiles.map(function (file_type) {
    if (file_type.startsWith('.')) {
      var ext = getFileExt(fileName);
      var patt = new RegExp(file_type.replace('.', ''), 'gmi');

      if (patt.test(ext) === true) {
        is_valid = true;
      }
    } else {
      var match_with = file_type;
      var _patt = '';

      if (file_type.endsWith('*')) {
        match_with.slice(0, -1);
        _patt = new RegExp('^' + match_with, 'gmi');
      } else {
        _patt = new RegExp(match_with, 'gmi');
      }

      if (_patt.test(fileType) === true) {
        is_valid = true;
      }
    }
  });
  return is_valid;
}
/**
 * To replace all searched keyword from string.
 */


String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};