# EvJs

Advanced genetic and evolutionary algorithm library written in Javascript by [notVitaliy](http://vitaliy.codes).


#### Install

```bash
yarn add evjs
```

## How To

```typescript
import { EvJs } from 'evjs'

const seed = () => {
  // Seed code here
}
const fitness = () => {
  // calculate fitness score
}
const mutate = () => {
  // mutate an individuals param(s)
}
const mate = () => {
  // breed 2 individuals
}

const evjs = new EvJs({
  size: 10,
  crossover: 0.7,
  mutation: 0.4,
  keepFittest: true,
  select: 'random',
  pair: 'tournament2',
  optimizeKey: 'Max',
  fitness,
  mutate,
  mate
})

evjs.populate(seed)
evjs.run()

```


## Generation Configuration Parameters

```typescript
interface GenerationConfig {
  size?: number
  crossover?: number
  mutation?: number
  keepFittest?: boolean
  optimizeKey?: 'Max' | 'Min'
  select: string
  selectN?: number
  pair?: string
}
```

| Parameter             | Default  | Range/Type  | Description
| --------------------- | -------- | ----------  | -----------
| size                  | 250      | Number      | Population size
| crossover             | 0.9      | [0.0, 1.0]  | Probability of crossover/breeding
| mutation              | 0.2      | [0.0, 1.0]  | Probability of mutation
| iterations            | 100      | Real Number | Maximum number of iterations before finishing
| keepFittest           | true     | Boolean     | Prevents losing the best fit between generations
| optimizeKey           | Max      | [Max, Min]  | Optimization method to use
| select                | N/A      | SelectType  | Generation->mutate select type to use
| pair                  | N/A      | SelectType  | Generation->breed select type to use


## Individual Configuration Parameters

```typescript
interface IndividualConfig {
  fitness: (entity: any): number
  mutate: (entity: any): any
  mate: (mother: any, father: any): [any, any]
}
```

| Parameter             | Type     | Description
| --------------------- | -------- | -----------
| fitness               | Function | Calculates the fitness score of an individual
| mutate                | Function | Mutates an individual
| mate                  | Function | Mates 2 individuals and returns 2 new individuals


### SelectType

| Selectors                 | Description
| -------------------------------- | -----------
| Tournament{N}   | Fittest of <iny>N random individuals
| Fittest         | Always selects the Fittest individual
| Random          | Randomly selects an individual

## Optimizer

The optimizer specifies how to rank individuals against each other based on an arbitrary fitness score. For example, minimizing the sum of squared error for a regression curve `Min` would be used, as a smaller fitness score is indicative of better fit.

| optimizeKey | Description
| ----------- | -----------
| Min         | The smaller fitness score of two individuals is best
| Max         | The greater fitness score of two individuals is best


## Selection

An algorithm can be either genetic or evolutionary depending on which selection operations are used.  An algorithm is evolutionary if it only uses a Single SelectType.  If both Single and Pair-wise operations are used (and if crossover is implemented) it is genetic.


| Select Type         | Required    | Description
| ------------------- | ----------- | -----------
| select  (Single)    | Yes         | Selects a single individual for survival from a population
| pair    (Pair-wise) | Optional    | Selects two individuals from a population for mating/crossover


## Building

To clone, build, and test Genetic.js issue the following command:

```bash
git clone git@github.com:notvitaliy/evjs.git
```

| Command               | Description
| --------------------- | -----------
| yarn                  | Automatically install dev-dependencies
| npm test              | Run unit tests


## Contributing

Feel free to open issues and send pull-requests.
