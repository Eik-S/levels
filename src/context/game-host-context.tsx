import { DataConnection, Peer, PeerErrorType } from 'peerjs'
import { createContext, useContext, useEffect, useState } from 'react'
import { Message } from '../models/message-model'
import { createHumanId } from '../utils/id-creator'
import { useSessionStorage } from '../hooks/use-session-storage'
import { HostPlayer } from '../models/players-model'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

interface GameHostContextApi {
  players: HostPlayer[]
  lobbyId: string | undefined
  messagePlayer: (message: Message, playerId: string) => void
}

function generateNewPlayer(id: string, connection: DataConnection): HostPlayer {
  return {
    id,
    connection,
  }
}

function useGameHost(): GameHostContextApi {
  const [lobbyId] = useSessionStorage('lobbyId', createHumanId())

  const [players, setPlayers] = useState<HostPlayer[]>([])

  // peer setup and error handling
  useEffect(() => {
    const peer = new Peer(lobbyId)

    peer.on('open', () => {
      console.log({ message: 'waiting for players to join', peer: { ...peer } })
    })
    peer.on('error', (err) => {
      const peerError = err as PeerJSError

      console.log({ peerError: peerError.type, peer })
    })

    peer.on('connection', (conn) => {
      const playerId = conn.peer
      console.log(`peer ${playerId} is connecting...`)
      conn.on('data', (data) => {
        console.log({ data })
      })
      conn.on('open', () => {
        console.log(`connection to ${playerId} opened`)
        setPlayers((prevPlayers) => [...prevPlayers, generateNewPlayer(playerId, conn)])
      })
      conn.on('close', () => {
        console.log(`connection to ${playerId} closed`)

        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId))
      })
    })
  }, [lobbyId])

  useEffect(() => {
    players.forEach(({ connection }) => {
      connection.send({
        type: 'playersStateChanged',
        players: players.map((player) => ({
          id: player.id,
        })),
      })
    })
  }, [players])

  function messagePlayer(message: Message, playerId: string) {
    const player = players.find((player) => player.id === playerId)
    if (player === undefined) return
    player.connection.send(message)
  }

  return {
    players,
    lobbyId,
    messagePlayer,
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
