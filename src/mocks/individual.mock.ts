import { Individual } from '../individual'
import { IndividualConfig, Fitness, Mutate, Mate } from '../individual/individual.model'

const letterMap  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const rand = n => Math.floor(Math.random() * n)
const range = (min, max) => rand((max - min + 1)) + min
const word = (n) => Array(n).fill(0).map(() => letterMap[range(0, 61)]).join('')

export const seed = () => word(32)
const password = (() => seed())()

export const configIndividual: IndividualConfig = {
  entity: seed(),
  fitness: (entity): number => {
    return entity.toString()
      .split('')
      .reduce((fitness, n, i) => {
        const nKey = letterMap.indexOf(n)
        const iKey = letterMap.indexOf(password[i])
        return fitness += 1 - (Math.abs(~~nKey - ~~iKey) / (letterMap.length - 1))
      }, 0)
  },
  mutate: (entity): any => {
    let entityArr = (<string>entity).split('')
    const shiftKey = range(0, entityArr.length - 1)
    const keyMapIndex = letterMap.indexOf(entityArr[shiftKey])
    const shiftDir = keyMapIndex === 0 ? 1
      : keyMapIndex === letterMap.length - 1 ? -1
      : rand(2) ? 1 : -1

    entityArr[shiftKey] = letterMap[keyMapIndex + shiftDir]

    return entityArr.join('')
  },
  mate: (mother, father) => {
    const fArr = (<string>father).split('')
    const mArr = (<string>mother).split('')
    const shiftKey = range(0, fArr.length - 1)

    fArr[shiftKey] = [mArr[shiftKey], mArr[shiftKey] = fArr[shiftKey]][0]

    return [
      fArr.join(''),
      mArr.join('')
    ]
  }
}
