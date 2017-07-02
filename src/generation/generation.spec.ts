import { expect } from 'chai'

import { Individual } from '../individual'
import { Optimize, Select } from '../utils'

import { Generation } from './generation'
import { configGeneration } from '../mocks/generation.mock'

import { configIndividual, seed } from '../mocks/individual.mock'

describe('Generation', () => {
  const baseConfig = Object.assign({}, configGeneration, configIndividual)
  let generation: Generation

  beforeEach(() => {
    generation = new Generation(baseConfig)
  })

  it('can add individuals to itself', () => {
    const entity = seed()
    const config = Object.assign({}, { entity }, configIndividual)
    const individual = new Individual(config)

    expect(generation.individuals.length)
      .to.equal(0)
    generation.add(individual)
    expect(generation.individuals.length)
      .to.equal(1)
  })

  it('can populate itself', () => {
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate('test')
    expect(generation.individuals.length)
      .to.equal(10)
  })

  it('won\'t overfill it self', () => {
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate('test')
    expect(generation.individuals.length)
      .to.equal(10)

    const entity = seed()
    const config = Object.assign({}, { entity }, configIndividual)
    const individual = new Individual(config)

    expect(generation.individuals.length)
      .to.equal(10)
    generation.add(individual)
    expect(generation.individuals.length)
      .to.equal(10)
  })

  it('can evaluate individuals', () => {
    generation.populate(seed)
    const sampleIndividualFitness = generation.individuals[0].fitness
    generation.evaluate()

    expect(sampleIndividualFitness)
      .to.be.undefined
    expect(generation.individuals[0].fitness)
      .to.not.equal(0)
    expect(generation.individuals[0].fitness)
      .to.not.equal(sampleIndividualFitness)
  })

  describe('sort and stats', () => {
    const sorts = ['Max', 'Min']

    beforeEach(() => {
      const config = Object.assign({}, baseConfig, { optimizeKey: sorts.shift()})
      generation = new Generation(config)

      generation.populate(seed)
      generation.evaluate()

      generation.sort()
    })

    it('can max', () => {
      expect(generation.individuals[0].fitness)
        .to.be.greaterThan(generation.individuals[9].fitness)

      const stats = generation.stats
      expect(stats.max)
        .to.be.greaterThan(stats.min)

      expect(stats.stdev)
        .to.be.lessThan(stats.max)
      expect(stats.stdev)
        .to.be.lessThan(stats.min)

      expect(stats.mean)
        .to.be.lessThan(stats.max)
      expect(stats.mean)
        .to.be.greaterThan(stats.min)
    })

    it('can min', () => {
      expect(generation.individuals[0].fitness)
        .to.be.lessThan(generation.individuals[9].fitness)

      const stats = generation.stats
      expect(stats.max)
        .to.be.greaterThan(stats.min)

      expect(stats.stdev)
        .to.be.lessThan(stats.max)
      expect(stats.stdev)
        .to.be.lessThan(stats.min)

      expect(stats.mean)
        .to.be.lessThan(stats.max)
      expect(stats.mean)
        .to.be.greaterThan(stats.min)
    })
  })

  it('can evolve', () => {
    generation.populate(seed)
    generation.evaluate()
    
    const newGeneration = generation.evolve()

    expect(newGeneration)
      .to.not.equal(generation)
  })

  it('makes an equal size generation', () => {
    const config = Object.assign({}, baseConfig, {
      crossover: 0.5, mutation: 1, size: 100, select: 'random', keepFittest: false
    })

    generation = new Generation(config)
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate(seed)
    expect(generation.individuals.length)
      .to.equal(100)

    generation.evaluate()

    const newGeneration = generation.evolve()
    expect(generation.individuals.length)
      .to.equal(newGeneration.individuals.length)

  })

  it('won\'t choke on large generations sizes ', () => {
    const config = Object.assign({}, baseConfig, {
      crossover: 0.5, mutation: -1, size: 10000, select: 'fittest'
    })

    generation = new Generation(config)
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate(seed)
    expect(generation.individuals.length)
      .to.equal(10000)

    generation.evaluate()

    const newGeneration = generation.evolve()
    expect(generation.individuals.length)
      .to.equal(newGeneration.individuals.length)
  })
})
