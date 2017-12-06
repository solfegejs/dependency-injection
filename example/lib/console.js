"use strict";

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _Bundle = require("../../lib/Bundle");

var _Bundle2 = _interopRequireDefault(_Bundle);

var _Bundle3 = require("./Bundle");

var _Bundle4 = _interopRequireDefault(_Bundle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = new _solfegejs2.default.Application();
application.addBundle(new _Bundle2.default());
application.addBundle(new _Bundle4.default());

var parameters = process.argv.slice(2);
application.start(parameters);