export class Generation {
  constructor(config) {
    this.size = config.size || 10
    this.crossover = config.crossover || 0.9
    this.mutation = config.mutation || 0.2
    this.optimize = config.optimize

    this.individuals = []
  }

  add(individual) {
    this.push(individual)
  }

  sort() {
    this.individuals = this.individuals.sort(this.optimize)
  }
}
