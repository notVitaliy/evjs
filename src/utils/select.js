"use strict";
exports.__esModule = true;
var Select = (function () {
    function Select(optimize) {
        var _this = this;
        this.pair = {
            tournament: function (population, n) { return [
                _this.tournament(population, n)[0],
                _this.tournament(population, n)[0]
            ]; },
            fittest: function (population) { return [
                _this.fittest(population)[0],
                _this.fittest(population)[0]
            ]; },
            random: function (population) { return [
                _this.random(population)[0],
                _this.random(population)[0]
            ]; }
        };
        this.optimize = optimize;
    }
    Select.prototype.tournament = function (population, n) {
        var _this = this;
        var _n = n < population.length
            ? n
            : population.length;
        var localPop = population.slice();
        var best = Array(_n).fill(0)
            .map(function () {
            var i = _this.getRandomIndividual(localPop);
            return localPop.splice(i, 1)[0];
        })
            .reduce(function (best, curr) {
            return _this.optimize(best, curr) === 1
                ? best
                : curr;
        });
        population.splice(population.indexOf(best), 1);
        return [best];
    };
    Select.prototype.fittest = function (population) {
        return [population.shift()];
    };
    Select.prototype.random = function (population) {
        var i = this.getRandomIndividual(population);
        return population.splice(i, 1);
    };
    Select.prototype.getRandomIndividual = function (population) {
        return Math.floor(Math.random() * population.length);
    };
    return Select;
}());
exports.Select = Select;
