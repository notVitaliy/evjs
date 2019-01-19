import { Individual } from '../individual'
import { Optimize, Select } from '../utils'

import { IndividualConfig } from '../individual'
import { GenerationConfig } from './generation.model'

export interface Config extends GenerationConfig, IndividualConfig {}

export class Generation {
  private config: GenerationConfig
  private individualConfig: IndividualConfig
  public individuals: Individual[]

  constructor(config: Config) {
    config.optimizeKey = config.optimizeKey || 'Max'

    this.config = {
      size: config.size || 10,
      crossover: config.crossover || 0.9,
      mutation: config.mutation || 0.2,
      keepFittest:
        typeof config.keepFittest !== 'undefined' ? config.keepFittest : true,
      optimizeKey: config.optimizeKey,
      optimize:
        config.optimizeKey === 'Max' ? new Optimize().max : new Optimize().min,
      select: config.select,
      pair: config.pair
    }

    this.individualConfig = {
      fitness: config.fitness,
      mutate: config.mutate,
      mate: config.mate
    }

    if (/tournament/g.test(this.config.select)) {
      this.config.selectN =
        Number(this.config.select.replace(/[^0-9]/g, '')) || 2
      this.config.select = this.config.select.replace(/[0-9]/g, '')
    }

    this.individuals = []
  }

  populate(seed: any): void {
    while (this.individuals.length < this.config.size) {
      const entity = typeof seed === 'function' ? seed() : seed

      const config = Object.assign({}, { entity }, this.individualConfig)
      const individual = new Individual(config).evolve()
      this.add(individual)
    }
  }

  add(individual: Individual) {
    if (this.individuals.length < this.config.size)
      this.individuals.push(individual)
  }

  async evaluate() {
    const individuals = this.individuals.map(individual =>
      individual.setFitness()
    )
    await Promise.all(individuals)
  }

  sort() {
    this.individuals = this.individuals.sort((a, b) =>
      this.config.optimize(a, b)
    )
  }

  evolve() {
    const individuals = [...this.individuals]
    const config = Object.assign({}, this.config, this.individualConfig)
    const generation = new Generation(config)

    if (this.config.keepFittest) {
      generation.individuals.push(individuals[0])
      generation.individuals.push(individuals[0].evolve())
    }

    const select = new Select(this.config.optimize)

    const selectFn = (select: Select['pair']) => {
      return typeof this.config.selectN === 'undefined'
        ? select[this.config.select](individuals)
        : select[this.config.select](individuals, this.config.selectN)
    }

    while (generation.individuals.length < generation.config.size) {
      if (individuals.length >= 2 && this.shouldBreed()) {
        let kids = selectFn(select.pair)
        kids = kids[0].breed(kids[1])

        generation.add(kids[0])
        generation.add(kids[1])
      } else {
        let kid = selectFn(select)[0]
        kid = Math.random() <= this.config.mutation ? kid.evolve() : kid
        generation.add(kid)
      }
    }

    return generation
  }

  get stats() {
    const fitnesses = this.individuals.map(individual => individual.fitness)

    const mean = fitnesses.reduce((a, b) => a + b) / fitnesses.length
    const stdev = this.getStandardDeviation(fitnesses, mean)
    let max = fitnesses[0]
    let min = fitnesses[fitnesses.length - 1]

    if (this.config.optimizeKey === 'Min') {
      max = [min, (min = max)][0]
    }

    return { max, min, mean, stdev }
  }

  private getStandardDeviation(items: number[], mean: number) {
    const variance =
      items.map(item => (item - mean) * (item - mean)).reduce((a, b) => a + b) /
      items.length

    return Math.sqrt(variance)
  }

  private shouldBreed() {
    return this.config.crossover > 0 && Math.random() <= this.config.crossover
  }
}
