"use strict";
exports.__esModule = true;
var chalk = require("chalk");
var generation_1 = require("../generation");
var EvJs = (function () {
    function EvJs(config) {
        this.iteration = 0;
        this.iterations = config.iterations;
        var size = config.size, crossover = config.crossover, mutation = config.mutation, keepFittest = config.keepFittest, select = config.select, pair = config.pair, optimizeKey = config.optimizeKey, fitness = config.fitness, mutate = config.mutate, mate = config.mate, notification = config.notification;
        this.config = { size: size, crossover: crossover, mutation: mutation, keepFittest: keepFittest, select: select,
            pair: pair, optimizeKey: optimizeKey, fitness: fitness, mutate: mutate, mate: mate, notification: notification };
    }
    EvJs.prototype.create = function (seed) {
        this.generation = new generation_1.Generation(this.config);
        this.generation.populate(seed);
    };
    EvJs.prototype.run = function () {
        while (this.iteration < this.iterations) {
            this.generation = this.generation.evolve();
            this.iteration++;
            this.evaluate();
        }
    };
    EvJs.prototype.evaluate = function () {
        this.generation.evaluate();
        this.generation.sort();
        var percentDone = (this.iteration * 100 / this.iterations);
        var generation = chalk.red("GENERATION: " + this.iteration);
        this.log(generation);
        if (this.iteration === 1 || this.iteration === this.iterations || percentDone % (this.config.notification * 100) === 0) {
            this.notify();
        }
    };
    EvJs.prototype.notify = function () {
        var _this = this;
        var stats = this.generation.stats;
        var statsStr = chalk.blue(JSON.stringify(stats, null, 2));
        this.log("Stats: " + statsStr);
        this.generation.individuals.forEach(function (individual) {
            var name = individual.name.first + " " + individual.name.last;
            var config = individual.entity;
            var deviation = Math.abs(stats.mean - individual.fitness);
            var fitness = individual.fitness;
            var data = { fitness: fitness, deviation: deviation, config: config, name: name };
            var json = chalk.green(JSON.stringify(data, null, 1));
            _this.log("Individual: " + json);
        });
        this.log('');
    };
    EvJs.prototype.log = function (str) {
        console.log(str);
    };
    return EvJs;
}());
exports.EvJs = EvJs;
