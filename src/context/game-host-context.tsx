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

interface GameHostContextApi {
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

function useGameHost(): GameHostContextApi {
  const [lobbyId, setLobbyId] = useSessionStorage('lobbyId', createHumanId())
  const [peer, setPeer] = useState<Peer | undefined>(undefined)

  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (lobbyId === undefined || peer !== undefined) return
    const newPeer = new Peer(lobbyId)
    newPeer.on('error', (err) => {
      const peerError = err as PeerJSError
      console.log({ errorType: peerError.type, newPeer })

      // retry connecting with new playerId
      setLobbyId(createHumanId())
      setPeer(undefined)
    })
    newPeer.on('open', () => {
      console.log({ message: 'peer successfully created', newPeer })
      setPeer(newPeer)
    })
  }, [peer, lobbyId, setLobbyId])

  // initiate peer connection
  // if all parameters are set
  useEffect(() => {
    if (lobbyId === undefined || peer === undefined) return
    console.log('awaiting connections')
    peer.on('connection', (conn) => {
      const playerId = conn.peer
      console.log(`peer ${playerId} is connecting...`)
      conn.on('data', (data) => {
        console.log({ data })
      })
      conn.on('open', () => {
        console.log(`connection to ${playerId} openened`)
        setPlayers((prevPlayers) => [...prevPlayers, generateNewPlayer(playerId, conn)])
      })
      conn.on('close', () => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId))
      })
    })
  }, [lobbyId, peer])

  return {
    players,
    lobbyId,
  }
}
const GameHostContext = createContext<GameHostContextApi | undefined>(undefined)

export function GameHostContextProvider({ children }: { children: React.ReactNode }) {
  const game = useGameHost()

  return <GameHostContext.Provider value={game}>{children}</GameHostContext.Provider>
}

export function useGameHostContext() {
  const context = useContext(GameHostContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
