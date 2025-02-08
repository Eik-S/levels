import { GameState } from './game-model'
import { Player } from './players-model'

export interface MessageBase {
  type: 'playersStateChanged' | 'leave' | 'gameStateChanged' | 'test'
}

export interface PlayerStateMessage extends MessageBase {
  type: 'playersStateChanged'
  players: Player[]
}

export interface GameStateMessage extends MessageBase {
  type: 'gameStateChanged'
  gameState: GameState
}

export interface Greeting extends MessageBase {
  type: 'test'
  message: string
}

export type Message = PlayerStateMessage | GameStateMessage | Greeting
