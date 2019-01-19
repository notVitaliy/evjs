import chalk from 'chalk'

import { Generation, GenerationConfig } from '../generation'
import { IndividualConfig } from '../individual'

export { GenerationConfig } from '../generation'
export { IndividualConfig } from '../individual'

export interface Config extends GenerationConfig, IndividualConfig {
  iterations?: number
  notification?: number
  notifyBestOnly?: boolean
}

export class EvJs {
  private iteration: number
  private iterations: number
  private config: Config

  public generation: Generation

  constructor(config: Config) {
    this.iteration = 0
    this.iterations = config.iterations

    const {
      size,
      crossover,
      mutation,
      keepFittest,
      select,
      pair,
      optimizeKey,
      fitness,
      mutate,
      mate,
      notification,
      notifyBestOnly: notifyIndividual
    } = config

    this.config = {
      size,
      crossover,
      mutation,
      keepFittest,
      select,
      pair,
      optimizeKey,
      fitness,
      mutate,
      mate,
      notification,
      notifyBestOnly: notifyIndividual
    }
  }

  create(seed: any) {
    this.generation = new Generation(this.config)
    this.generation.populate(seed)
  }

  async run() {
    while (this.iteration < this.iterations) {
      await this.evaluate()

      this.generation = this.generation.evolve()
      this.iteration++
    }
  }

  private async evaluate() {
    await this.generation.evaluate()
    this.generation.sort()

    const percentDone = (this.iteration * 100) / this.iterations

    const generation = chalk.red(`GENERATION: ${this.iteration}`)
    this.log(generation)

    if (
      this.iteration === 1 ||
      this.iteration === this.iterations ||
      percentDone % (this.config.notification * 100) === 0
    ) {
      this.notify()
    }
  }

  private notify() {
    const stats = this.generation.stats
    const statsStr = chalk.blue(JSON.stringify(stats, null, 2))
    this.log(`Stats: ${statsStr}`)

    if (this.config.notifyBestOnly) {
      const individual = this.generation.individuals[0]
      const name = `${individual.name.first} ${individual.name.last}`
      const config = individual.entity
      const deviation = Math.abs(stats.mean - individual.fitness)
      const fitness = individual.fitness
      const data = { fitness, deviation, config, name }

      const json = chalk.green(JSON.stringify(data, null, 1))
      this.log(`Individual: ${json}`)

      return this.log('')
    }

    this.generation.individuals.forEach(individual => {
      const name = `${individual.name.first} ${individual.name.last}`
      const config = individual.entity
      const deviation = Math.abs(stats.mean - individual.fitness)
      const fitness = individual.fitness
      const data = { fitness, deviation, config, name }

      const json = chalk.green(JSON.stringify(data, null, 1))
      this.log(`Individual: ${json}`)
    })

    this.log('')
  }

  log(str: string) {
    console.log(str)
  }
}
