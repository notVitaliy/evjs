export interface Fitness {
  (entity: any, name: string): number
}
export interface Mutate {
  (entity: any, name: string): any
}
export interface Mate {
  (mother: any, father: any, motherName: string, fatherName: string): [any, any]
}
export interface IndividualConfig {
  fitness: Fitness
  mutate: Mutate
  mate: Mate
  entity?: any

  name?: {
    first?: string
    last: string
  }
}
