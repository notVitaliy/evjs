import { expect } from 'chai'
import * as sinon from 'sinon'

import { EvJs } from './evjs'

import { Generation, GenerationConfig } from '../generation'
import { IndividualConfig } from '../individual'
import { Optimize } from '../utils/optimize'

import { configGeneration, configIndividual, seed } from '../mocks'

const config = Object.assign({
  iterations: 10,
  notification: 0.3
}, configGeneration, configIndividual)

describe('evjs',  () => {
  let evjs: EvJs

  beforeEach(() => {
    evjs = new EvJs(config)
  })

  it('can log', () => {
    const stub = sinon.stub(console, 'log')

    evjs.log('')

    expect(stub.calledWith(''))
      .to.be.true

    ;(<any>console).log.restore()
  })

  describe('main', () => {
    beforeEach(() => {
      sinon.stub(evjs, 'log')
    })

    afterEach(() => {
      (<any>evjs).log.restore()
    })

    it('can create the first generation', () => {
      expect(evjs.generation)
        .to.be.undefined
      evjs.create(seed)

      expect(evjs.generation.individuals.length)
        .to.equal(10)
    })

    it('can run', () => {
      expect(evjs.generation)
        .to.be.undefined
      evjs.create(seed)
      expect(evjs.generation.individuals.length)
        .to.equal(10)

      evjs.run()
      expect(evjs.generation.individuals.length)
        .to.equal(10)
    })

    it('notifies first, last and n%3 generations', () => {
      // 5 notifications (5) = N
      // 2 logs per notification (N * 2) = N
      // 10 logs per generation (N * 10) = N
      // 10 generations (N + 10)
      // 10 stats (N + 10)
      // ((5 * 2) * 10) + 10 + 10
      const count = 70
      evjs.create(seed)
      evjs.run()

      sinon.assert.callCount(<any>evjs.log, count)
    })
  })
})
