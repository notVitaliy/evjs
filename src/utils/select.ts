import { Individual } from '../individual'

export class Select {
  public optimize

  constructor (optimize) {
    this.optimize = optimize
  }

  tournament(population: Individual[], n: number) {
    const _n: number = n < population.length
      ? n
      : population.length

    const localPop = [...population]
    const best = Array(_n).fill(0)
      .map(() => {
        const i = this.getRandomIndividual(localPop)
        return localPop.splice(i, 1)[0]
      })
      .reduce((best, curr) => {
        return this.optimize(best, curr) === 1
          ? best
          : curr
      })

    population.splice(population.indexOf(best), 1)
    return [best]
  }

  fittest(population) {
    return [population.shift()]
  }

  random(population) {
    const i = this.getRandomIndividual(population)
    return population.splice(i, 1)
  }

  getRandomIndividual(population) {
    return Math.floor(Math.random() * population.length)
  }

  pair = {
    tournament: (population, n) => [
      this.tournament(population, n)[0],
      this.tournament(population, n)[0]
    ],
    fittest: (population) => [
      this.fittest(population)[0],
      this.fittest(population)[0]
    ],
    random: (population) => [
      this.random(population)[0],
      this.random(population)[0]
    ]
  }
}
