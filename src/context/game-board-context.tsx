import { DataConnection, Peer, PeerErrorType } from 'peerjs'
import { createContext, useContext, useEffect, useState } from 'react'
import { Card } from '../card'
import { useSessionStorage } from '../hooks/use-session-storage'
import { createHumanId } from '../utils/id-creator'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

export type Player = {
  id: string
  handCards: Card[]
  level: number
  connection: DataConnection
}

interface GameBoardContextApi {
  players: Player[]
  lobbyId: string | undefined
}

function generateNewPlayer(id: string, connection: DataConnection): Player {
  return {
    id,
    handCards: [],
    level: 1,
    connection,
  }
}

function useGame(): GameBoardContextApi {
  const [lobbyId] = useSessionStorage('lobbyId', createHumanId())
  const [peer, setPeer] = useState<Peer | undefined>(undefined)

  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (lobbyId === undefined || peer !== undefined) return
    setPeer(new Peer(lobbyId))
  }, [peer, lobbyId])

  // initiate peer connection
  // if all parameters are set
  useEffect(() => {
    if (lobbyId === undefined || peer === undefined) return

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.log({ data })
      })
      conn.on('open', () => {
        setPlayers((prevPlayers) => [...prevPlayers, generateNewPlayer(conn.peer, conn)])
      })
      conn.on('close', () => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== conn.peer))
      })
    })
    peer.on('error', (err) => {
      const peerError = err as PeerJSError
      console.log({ errorType: peerError.type, peer })
    })
  }, [lobbyId, peer])

  return {
    players,
    lobbyId,
  }
}
const GameBoardContext = createContext<GameBoardContextApi | undefined>(undefined)

export function GameBoardContextProvider({ children }: { children: React.ReactNode }) {
  const game = useGame()

  return <GameBoardContext.Provider value={game}>{children}</GameBoardContext.Provider>
}

export function useGameBoardContext() {
  const context = useContext(GameBoardContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
