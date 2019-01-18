import { Individual } from '../individual'

type Optimize = (best: Individual, curr: Individual) => number

export class Select {
  public optimize: Optimize

  constructor (optimize: Optimize) {
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

  fittest(population: Individual[]) {
    return [population.shift()]
  }

  random(population: Individual[]) {
    const i = this.getRandomIndividual(population)
    return population.splice(i, 1)
  }

  getRandomIndividual(population: Individual[]) {
    return Math.floor(Math.random() * population.length)
  }

  pair = {
    tournament: (population: Individual[], n: number) => [
      this.tournament(population, n)[0],
      this.tournament(population, n)[0]
    ],
    fittest: (population: Individual[]) => [
      this.fittest(population)[0],
      this.fittest(population)[0]
    ],
    random: (population: Individual[]) => [
      this.random(population)[0],
      this.random(population)[0]
    ]
  }
}
