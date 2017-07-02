import { expect } from 'chai'

import { Individual } from './individual'
import { configIndividual } from '../mocks/individual.mock'

describe('Individual', () => {
  let individual: Individual

  beforeEach(() => {
    individual = new Individual(configIndividual)
  })

  it('can rate its fitness', () => {
    individual.setFitness()
    expect(individual.fitness).to.not.be.undefined
    expect(individual.fitness).to.be.greaterThan(0)
  })

  it('makes a new Individual when evolving', () => {
    const newIndividual = individual.evolve()

    expect(individual.entity)
      .to.not.equal(newIndividual.entity)
  })

  it('can breed with other individuals', () => {
    const newIndividual = individual.evolve()
    const kids = individual.breed(newIndividual)

    expect(kids.length)
      .to.equal(2)
    expect(kids[0])
      .to.not.equal(kids[1])
  })
})
