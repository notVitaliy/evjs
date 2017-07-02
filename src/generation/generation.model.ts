import { Individual } from '../individual'

export interface GenerationConfig {
  size?: number
  crossover?: number
  mutation?: number
  keepFittest?: boolean
  optimizeKey?: 'Max' | 'Min'
  optimize?: ((a: Individual, b: Individual) => number)
  select: string
  selectN?: number
  pair?: string
}
