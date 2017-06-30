export class Individual {
  constructor(config) {
    this.props = config.props

    this.fitnessFn = config.fitness
    this.mutateFn = config.mutate
    this.mateFn = config.mate
  }

  fitnessSelf() {
    return this.fitnessFn(this.props)
  }

  mutateSelf() {
    const props = Object.assign({}, this.props)
    const mutated = this.mutateFn(props)
    const config = this.makeConfig(mutated)

    return new Individual(config)
  }

  breed(other) {
    const mother = Object.assign({}, this.props)
    const father = Object.assign({}, other.props)
    let { son, daughter } = this.mateFn(mother, father)
    son = this.makeConfig(son)
    daughter = this.makeConfig(daughter)

    return [
      new Individual(son),
      new Individual(daughter)
    ]
  }

  makeConfig(props) {
    const config = {
      props,
      fitness: this.fitnessFn,
      mutate: this.mutateFn,
      mate: this.mateFn
    }
  }
}
