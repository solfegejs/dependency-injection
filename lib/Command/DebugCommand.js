"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _safe = require("colors/safe");

var _safe2 = _interopRequireDefault(_safe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DebugCommand = class DebugCommand {
  constructor() {
    this.description = "";
  }

  setContainer(container) {
    this.container = container;
  }

  getContainer() {
    return this.container;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = description;
  }

  *configure() {
    this.setName("dependency-injection:debug");
    this.setDescription("Debug dependency injection");
  }

  *execute() {
    var container = this.getContainer();
    var definitions = container.getDefinitions();

    console.info(_safe2.default.yellow("Services"));
    console.info(_safe2.default.yellow("========"));
    console.info("");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = definitions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref = _step.value;

        var _ref2 = _slicedToArray(_ref, 2);

        var id = _ref2[0];
        var definition = _ref2[1];

        console.info(_safe2.default.green("ID   : ") + _safe2.default.bgBlack.cyan("" + id));
        console.info(_safe2.default.green("Class: ") + definition.getClassPath());
        console.info("");
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
};
exports.default = DebugCommand;
module.exports = exports["default"];