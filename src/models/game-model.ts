import { Card, createMixedSet as createMixedSetOfCards } from './card-model'
import { HostPlayer, Player } from './players-model'
import { Table } from './table-model'

type Hands = Record<string, Card[]>
export type GameState = 'running' | 'finished'

export interface Game {
  state: GameState
  movingPlayer: Player
  table: Table
  hands: Hands
}

export function createNewGame(hostPlayers: HostPlayer[]): Game {
  const players: Player[] = hostPlayers.map((player) => ({
    id: player.id,
  }))

  return {
    state: 'running',
    movingPlayer: players[0],
    table: {
      groups: [],
      drawPile: createMixedSetOfCards(),
      discardPile: [],
    },
    hands: players.reduce((total: Hands, player) => {
      total[player.id] = []
      return total
    }, {}),
  }
}
