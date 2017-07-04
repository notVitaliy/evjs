"use strict";
exports.__esModule = true;
var Optimize = (function () {
    function Optimize() {
    }
    Optimize.prototype.max = function (a, b) {
        return a.fitness > b.fitness ? -1 : 1;
    };
    Optimize.prototype.min = function (a, b) {
        return a.fitness > b.fitness ? 1 : -1;
    };
    return Optimize;
}());
exports.Optimize = Optimize;
