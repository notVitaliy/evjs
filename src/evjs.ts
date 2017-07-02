import { Generation, GenerationConfig } from './generation'
import { IndividualConfig } from './individual'
import { Optimize } from './utils/optimize'

interface Config extends GenerationConfig, IndividualConfig {
  seed?: any
  iterations?: number
}

export class EvJs {
  private seed: any
  private iteration: number
  private iterations: number
  private config: Config

  public generation: Generation

  constructor(config: Config) {
    this.seed = config.seed
    this.iteration = 0
    this.iterations = config.iterations

    const { size, crossover, mutation, keepFittest, select,
      pair, optimizeKey, fitness, mutate, mate } = config

    this.config = { size, crossover, mutation, keepFittest,
      select, pair, optimizeKey, fitness, mutate, mate }
  }

  create() {
    this.generation = new Generation(this.config)
    this.generation.populate(this.seed)
  }

  run() {
    while(this.iteration < this.iterations) {
      this.generation.evaluate()
      this.generation.sort()

      this.generation = this.generation.evolve()
      
      this.iteration++
    }
  }
}
