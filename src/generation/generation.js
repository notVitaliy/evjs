"use strict";
exports.__esModule = true;
var individual_1 = require("../individual");
var utils_1 = require("../utils");
var Generation = (function () {
    function Generation(config) {
        config.optimizeKey = config.optimizeKey || 'Max';
        this.config = {
            size: config.size || 10,
            crossover: config.crossover || 0.9,
            mutation: config.mutation || 0.2,
            keepFittest: typeof config.keepFittest !== 'undefined'
                ? config.keepFittest : true,
            optimizeKey: config.optimizeKey,
            optimize: config.optimizeKey === 'Max'
                ? new utils_1.Optimize().max : new utils_1.Optimize().min,
            select: config.select,
            pair: config.pair
        };
        this.individualConfig = {
            fitness: config.fitness,
            mutate: config.mutate,
            mate: config.mate
        };
        if (/tournament/g.test(this.config.select)) {
            this.config.selectN = Number(this.config.select.replace(/[^0-9]/g, '')) || 2;
            this.config.select = this.config.select.replace(/[0-9]/g, '');
        }
        this.individuals = [];
    }
    Generation.prototype.populate = function (seed) {
        while (this.individuals.length < this.config.size) {
            var entity = typeof seed === 'function'
                ? seed()
                : seed;
            var config = Object.assign({}, { entity: entity }, this.individualConfig);
            var individual = new individual_1.Individual(config).evolve();
            this.add(individual);
        }
    };
    Generation.prototype.add = function (individual) {
        if (this.individuals.length < this.config.size)
            this.individuals.push(individual);
    };
    Generation.prototype.evaluate = function () {
        this.individuals.forEach(function (individual) { return individual.setFitness(); });
    };
    Generation.prototype.sort = function () {
        var _this = this;
        this.individuals = this.individuals.sort(function (a, b) { return _this.config.optimize(a, b); });
    };
    Generation.prototype.evolve = function () {
        var _this = this;
        var individuals = this.individuals.slice();
        var config = Object.assign({}, this.config, this.individualConfig);
        var generation = new Generation(config);
        if (this.config.keepFittest) {
            generation.individuals.push(individuals.shift());
        }
        var select = new utils_1.Select(this.config.optimize);
        var selectFn = function (select) {
            return typeof _this.config.selectN === 'undefined'
                ? select[_this.config.select](individuals)
                : select[_this.config.select](individuals, _this.config.selectN);
        };
        while (generation.individuals.length < generation.config.size) {
            if (individuals.length >= 2 && this.shouldBreed()) {
                var kids = selectFn(select.pair);
                kids = kids[0].breed(kids[1]);
                generation.add(kids[0]);
                generation.add(kids[1]);
            }
            else {
                var kid = selectFn(select)[0];
                kid = Math.random() <= this.config.mutation
                    ? kid.evolve()
                    : kid;
                generation.add(kid);
            }
        }
        return generation;
    };
    Object.defineProperty(Generation.prototype, "stats", {
        get: function () {
            var fitnesses = this.individuals
                .map(function (individual) { return individual.fitness; });
            var mean = fitnesses.reduce(function (a, b) { return a + b; }) / fitnesses.length;
            var stdev = this.getStandardDeviation(fitnesses, mean);
            var max = fitnesses[0];
            var min = fitnesses[fitnesses.length - 1];
            if (this.config.optimizeKey === 'Min') {
                max = [min, min = max][0];
            }
            return { max: max, min: min, mean: mean, stdev: stdev };
        },
        enumerable: true,
        configurable: true
    });
    Generation.prototype.getStandardDeviation = function (items, mean) {
        var variance = items
            .map(function (item) { return (item - mean) * (item - mean); })
            .reduce(function (a, b) { return a + b; }) / items.length;
        return Math.sqrt(variance);
    };
    Generation.prototype.shouldBreed = function () {
        return this.config.crossover > 0
            && Math.random() <= this.config.crossover;
    };
    return Generation;
}());
exports.Generation = Generation;
