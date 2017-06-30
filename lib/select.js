export class Select {
  constructor (population, optimize) {
    this.population = population
    this.popLen = this.population.length
    this.optimize = optimize
  }

  tournament(n) {
    const population = [...this.population]
    const best = Array(n).fill()
      .map(() => this.getRandomIndividual(population))
      .reduce((best, curr) => {
        return this.optimize(best.fitness, curr.fitness)
          ? best
          : curr
      })

    return best.entity
  }

  fittest() {
    return this.population[0]
  }

  random() {
    return this.getRandomIndividual().entity
  }

  randomLinearRank() {
    const min = Math.min(this.popLen, ++this.state.rlr)
    const i = Math.floor(Math.random() * min)
    return this.population[i].entity
  }

  sequential() {
    const i = ++this.state.seq % this.popLen
    return this.population[i].entity
  }

  getRandomIndividual(population = this.population) {
    const i = Math.floor(Math.random() * population.length)
    if (population !== this.population) {
      return population.splice(i, 1)
    }
    return population[i]
  }

  pair = {
    tournament: n => [ this.tournament(n), this.tournament(n) ],
    fittest: () => [ this.fittest(), this.fittest() ],
    random: () => [ this.random(), this.random() ],
    randomLinearRank: () => [ this.randomLinearRank(), this.randomLinearRank() ],
    sequential: () => [ this.sequential(), this.sequential() ]
  }
}
