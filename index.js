'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = countKeys;

var _defaultTo = require('default-to');

var _defaultTo2 = _interopRequireDefault(_defaultTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function countKeys(obj, spec) {
	spec = (0, _defaultTo2.default)(spec, {
		recursive: true,
		arrays: true,
		filter: function filter(item) {
			return true;
		},
		maxDepth: 'none'
	});

	var count = 0;

	function raiseCount(thisObject, parent, depth) {
		var returnVal = count;

		thisObject = (0, _defaultTo2.default)(thisObject, {});

		for (var key in thisObject) {

			if (thisObject.hasOwnProperty(key)) {
				var value = thisObject[key];

				var arrayCheck = spec.arrays ? true : isNaN(parseInt(key));

				var filter = spec.filter.call(thisObject, { key: key, value: value, count: count, parent: parent, depth: depth });
				filter = (0, _defaultTo2.default)(filter, true);

				if (filter && arrayCheck) count++;

				var isUnderMaxDepth = isNaN(spec.maxDepth) ? true : depth < spec.maxDepth;
				var isRecursive = spec.recursive && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';

				if (isUnderMaxDepth && isRecursive) {
					returnVal = raiseCount(value, thisObject, depth + 1);
				} else {
					returnVal = count;
				}
			}
		}

		return returnVal;
	}
	return raiseCount(obj, false, 1);
}
module.exports = exports['default'];