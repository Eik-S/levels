import { Peer, PeerErrorType } from 'peerjs'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSessionStorage } from '../hooks/use-session-storage'
import { createHumanId } from '../utils/id-creator'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

type SessionStatus = 'ready' | 'connected' | 'disconnected' | 'failed'
interface GameClientContextApi {
  lobbyId: string | undefined
  playerId: string | undefined
  playerNames: string[]
  sessionStatus: SessionStatus
}

function useGameClient({ lobbyId }: { lobbyId: string }): GameClientContextApi {
  const [playerId, setPlayerId] = useSessionStorage('playerId', createHumanId())
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('disconnected')

  useEffect(() => {
    if (peer !== undefined) return
    const newPeer = new Peer(playerId)

    newPeer.on('error', (err) => {
      const peerError = err as PeerJSError
      const errorType = peerError.type
      console.debug({ errorType: errorType, newPeer, error: peerError })
      setSessionStatus('disconnected')

      if (
        errorType === 'unavailable-id' ||
        errorType === 'network' ||
        errorType === 'disconnected'
      ) {
        console.log('reconnecting')
        newPeer.reconnect()
      } else if (errorType === 'peer-unavailable') {
        setSessionStatus('failed')
      } else {
        console.log('switching player id')
        setPlayerId(createHumanId())
        setPeer(undefined)
      }
    })
    newPeer.on('open', () => {
      console.log({
        message: 'peer successfully created',
        playerId,
        newPeer: { ...newPeer },
      })
      setSessionStatus('ready')
      setPeer(newPeer)
    })
    return () => {
      newPeer.disconnect()
    }
  }, [playerId, peer, setPlayerId])

  // initiate peer connection
  // if all parameters are set
  useEffect(() => {
    if (peer === undefined || sessionStatus === 'disconnected') return

    const conn = peer.connect(lobbyId)
    console.log({ message: `connecting to host ${lobbyId}`, conn })
    if (conn === undefined) return

    conn.on('data', (data) => {
      console.log({ data })
    })
    conn.on('open', () => {
      console.log(`connection to host ${conn.peer} opened`)
    })
    conn.on('close', () => {
      console.log(`connection to host ${conn.peer} closed`)
    })
    conn.on('error', (err) => {
      const error = err as PeerJSError
      const errorType = error.type
      console.log({ errorType, conn })
    })
  }, [sessionStatus, lobbyId, peer, setPlayerId])

  return {
    lobbyId,
    playerId,
    playerNames,
    sessionStatus,
  }
}
const GameClientContext = createContext<GameClientContextApi | undefined>(undefined)

interface GameClientContextProviderProps {
  lobbyId: string
  children: ReactNode
}

export function GameClientContextProvider({ lobbyId, children }: GameClientContextProviderProps) {
  const game = useGameClient({ lobbyId })

  return <GameClientContext.Provider value={game}>{children}</GameClientContext.Provider>
}

export function useGameClientContext() {
  const context = useContext(GameClientContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
