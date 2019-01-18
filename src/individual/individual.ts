import Chance from 'chance'
const chance = new Chance()

import { IndividualConfig, Fitness, Mutate, Mate } from './individual.model'

export class Individual {
  public entity: any
  public fitness: number
  public name: {
    first: string
    last: string
  }

  private fitnessFn: Fitness
  private mutateFn: Mutate
  private mateFn: Mate

  constructor(config: IndividualConfig) {
    this.entity = config.entity

    this.name = {
      first: chance.first(),
      last: typeof config.name !== 'undefined' && typeof config.name.last !== 'undefined'
        ? config.name.last
        : chance.last()
    }

    this.fitnessFn = config.fitness
    this.mutateFn = config.mutate
    this.mateFn = config.mate
  }

  async setFitness(): Promise<void> {
    this.fitness = await this.fitnessFn(this.entity)
  }

  evolve(): Individual {
    const entity = this.entity
    const mutated = this.mutateFn(entity)
    const config = this.makeConfig(mutated)

    return new Individual(config)
  }

  breed(other: Individual): [Individual, Individual] {
    const mother = this.entity
    const father = other.entity
    const kids = this.mateFn(mother, father)
    const son = this.makeConfig(kids[0])
    const daughter = this.makeConfig(kids[1])

    son.name = daughter.name = {
      last: other.name.last
    }

    return [
      new Individual(son),
      new Individual(daughter)
    ]
  }

  makeConfig(entity: any): IndividualConfig {
    return {
      entity,
      fitness: this.fitnessFn,
      mutate: this.mutateFn,
      mate: this.mateFn
    }
  }
}
