import { expect } from 'chai'

import { Individual } from '../individual'

import { Generation } from './generation'
import { configGeneration, configIndividual, seed } from '../mocks'

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

  it('can evaluate individuals', async () => {
    generation.populate(seed)
    const sampleIndividualFitness = generation.individuals[0].fitness
    await generation.evaluate()

    expect(sampleIndividualFitness)
      .to.be.undefined
    expect(generation.individuals[0].fitness)
      .to.not.equal(0)
    expect(generation.individuals[0].fitness)
      .to.not.equal(sampleIndividualFitness)
  })

  describe('sort and stats', () => {
    const sorts = ['Max', 'Min']

    beforeEach(async () => {
      const config = Object.assign({}, baseConfig, { optimizeKey: sorts.shift()})
      generation = new Generation(config)

      generation.populate(seed)
      await generation.evaluate()

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

  it('can evolve', async () => {
    generation.populate(seed)
    await generation.evaluate()

    const newGeneration = generation.evolve()

    expect(newGeneration)
      .to.not.equal(generation)
  })

  it('makes an equal size generation', async () => {
    const config = Object.assign({}, baseConfig, {
      crossover: 0.5, mutation: 1, size: 100, select: 'random', keepFittest: false
    })

    generation = new Generation(config)
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate(seed)
    expect(generation.individuals.length)
      .to.equal(100)

    await generation.evaluate()

    const newGeneration = generation.evolve()
    expect(generation.individuals.length)
      .to.equal(newGeneration.individuals.length)

  })

  it('won\'t choke on large generations sizes ', async () => {
    const config = Object.assign({}, baseConfig, {
      crossover: 0.5, mutation: -1, size: 5000, select: 'fittest'
    })

    generation = new Generation(config)
    expect(generation.individuals.length)
      .to.equal(0)

    generation.populate(seed)
    expect(generation.individuals.length)
      .to.equal(5000)

    await generation.evaluate()

    const newGeneration = generation.evolve()
    expect(generation.individuals.length)
      .to.equal(newGeneration.individuals.length)
  })
})
