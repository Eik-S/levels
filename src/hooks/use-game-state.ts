import { useState } from 'react'
import { Card } from '../models/card-model'
import { createNewGame } from '../models/game-model'
import { HostPlayer } from '../models/players-model'
import { useSessionStorage } from './use-session-storage'

interface GameStateProps {
  players: HostPlayer[]
}

type TurnState = 'draw' | 'move' | 'discard'

export function useGameState({ players }: GameStateProps) {
  const [game, setGame] = useSessionStorage('game', createNewGame(players))
  const { hands, movingPlayer, table } = game
  const { discardPile, drawPile, groups } = table

  const [turnState, setTurnState] = useState<TurnState>('draw')

  function drawCard(): Card[] {
    if (turnState !== 'draw') {
      return hands[movingPlayer.id]
    }

    const card = drawPile.shift()!
    hands[movingPlayer.id].push(card)
    setTurnState('move')
    updateGame()

    return hands[movingPlayer.id]
  }

  function addCards(card: Card, targetGroupIndex: number, position: number) {
    const group = groups[targetGroupIndex]

    switch (position) {
      case 0:
        groups[targetGroupIndex] = [card, ...group]
        return
      case group.length:
        groups[targetGroupIndex] = [...group, card]
        return
      default:
        groups[targetGroupIndex] = [...group.slice(0, position), card, ...group.slice(position)]
    }

    updateGame()
  }

  function placeCards(cards: Card[], targetGroup: number) {
    groups.push(cards)
  }

  function resetGame() {
    if (players.length === 0) {
      console.error('cant reset without players')
    }
    setGame(createNewGame(players))
  }

  function updateGame() {
    setGame((prevGame) => ({
      ...prevGame,
      hands,
      movingPlayer,
      table: {
        ...table,
        discardPile,
        drawPile,
        groups,
      },
    }))
  }

  return {
    game,
    table,
    movingPlayer,
    drawCard,
    placeCards,
    addCards,
    resetGame,
  }
}
