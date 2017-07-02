export interface Fitness {
  (entity: any): number
}
export interface Mutate {
  (entity: any): any
}
export interface Mate {
  (mother: any, father: any): [any, any]
}
export interface IndividualConfig {
  fitness: Fitness
  mutate: Mutate
  mate: Mate
  entity?: any
}
