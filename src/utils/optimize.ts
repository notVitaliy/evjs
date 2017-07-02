import { Individual } from '../individual'

export class Optimize {
  max(a: Individual, b: Individual) {
    return a.fitness > b.fitness ? -1 : 1
  }

  min(a: Individual, b: Individual) {
    return a.fitness > b.fitness ? 1 : -1
  }
}
