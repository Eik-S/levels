import { DataConnection, Peer, PeerErrorType } from 'peerjs'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSessionStorage } from '../hooks/use-session-storage'
import { Message } from '../models/messages'
import { createPlayerId } from '../utils/id-creator'

export type GameMode = 'host' | 'join'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

export type Player = {
  id: string
}

interface GameContextApi {
  players: Player[]
  gameMode: GameMode | undefined
  playerId: string
  lobbyId: string | undefined
  joinGame: (id: string) => void
  createLobby: () => void
}

function useGame(): GameContextApi {
  const [playerId, setPlayerId] = useSessionStorage('playerId', createPlayerId())
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [lobbyId, setLobbyId] = useState<string | undefined>(undefined)
  const [conn, setConn] = useState<DataConnection | undefined>(undefined)

  const [gameMode, setGameMode] = useState<GameMode | undefined>(undefined)
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (playerId === undefined || peer !== undefined) return
    setPeer(new Peer(playerId))
  }, [peer, playerId])

  // initiate peer connection
  // if all parameters are set
  useEffect(() => {
    if (lobbyId === undefined || gameMode === undefined || peer === undefined || conn !== undefined)
      return

    function handleMessageReceived(message: Message) {
      if (message.type === 'join') {
        setPlayers((prevPlayers) => [...prevPlayers, { id: message.id }])
      }
      if (message.type === 'leave') {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== message.id))
      }
    }

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.log('data received')
        handleMessageReceived(data as Message)
      })
      conn.on('open', () => {
        setPlayers((prevPlayers) => [...prevPlayers, { id: conn.peer }])
      })
      conn.on('close', () => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== conn.peer))
      })
    })
    peer.on('error', (err) => {
      const peerError = err as PeerJSError
      console.log({ errorType: peerError.type, peer })
      if (peerError.type === 'disconnected') {
        if (peer.disconnected === true && peer.destroyed === false) {
          console.log('reconnecting...')
          peer.reconnect()
        }
        if (peer.disconnected === true && peer.destroyed === true) {
          console.log('cannot reconnect, peer is destroyed')
          peer.destroy()
          setPeer(undefined)
          setPlayerId(createPlayerId())
        }
      }
    })

    if (gameMode === 'join') {
      const connection = peer.connect(lobbyId)
      console.log({ connection })
      if (connection) {
        connection.on('open', () => {
          setConn(connection)
        })
      }
      return () => {
        peer.disconnect()
      }
    }
  }, [lobbyId, gameMode, peer, setPlayerId])

  function createLobby() {
    setGameMode('host')
    setLobbyId(playerId)
  }

  function joinGame(id: string) {
    setGameMode('join')
    setLobbyId(id)
  }

  return {
    gameMode,
    players,
    playerId,
    lobbyId,
    joinGame,
    createLobby,
  }
}
const GameContext = createContext<GameContextApi | undefined>(undefined)

export function GameContextProvider({ children }: { children: React.ReactNode }) {
  const game = useGame()

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
