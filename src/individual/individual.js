"use strict";
exports.__esModule = true;
var Chance = require("chance");
var chance = new Chance();
var Individual = (function () {
    function Individual(config) {
        this.entity = config.entity;
        this.name = {
            first: chance.first(),
            last: typeof config.name !== 'undefined' && typeof config.name.last !== 'undefined'
                ? config.name.last
                : chance.last()
        };
        this.fitnessFn = config.fitness;
        this.mutateFn = config.mutate;
        this.mateFn = config.mate;
    }
    Individual.prototype.setFitness = function () {
        this.fitness = this.fitnessFn(this.entity);
    };
    Individual.prototype.evolve = function () {
        var entity = this.entity;
        var mutated = this.mutateFn(entity);
        var config = this.makeConfig(mutated);
        return new Individual(config);
    };
    Individual.prototype.breed = function (other) {
        var mother = this.entity;
        var father = other.entity;
        var kids = this.mateFn(mother, father);
        var son = this.makeConfig(kids[0]);
        var daughter = this.makeConfig(kids[1]);
        son.name = daughter.name = {
            last: other.name.last
        };
        return [
            new Individual(son),
            new Individual(daughter)
        ];
    };
    Individual.prototype.makeConfig = function (entity) {
        return {
            entity: entity,
            fitness: this.fitnessFn,
            mutate: this.mutateFn,
            mate: this.mateFn
        };
    };
    return Individual;
}());
exports.Individual = Individual;
