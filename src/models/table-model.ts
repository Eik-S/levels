import { Card } from './card-model'

interface Point {
  x: number
  y: number
}

export interface Table {
  groups: Card[][]
  drawPile: Card[]
  discardPile: Card[]
}
