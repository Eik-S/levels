import { Peer, PeerErrorType } from 'peerjs'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSessionStorage } from '../hooks/use-session-storage'
import { createHumanId } from '../utils/id-creator'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

interface GameClientContextApi {
  lobbyId: string | undefined
  playerId: string | undefined
  playerNames: string[]
}

function useGameClient({ lobbyId }: { lobbyId: string }): GameClientContextApi {
  const [playerId, setPlayerId] = useSessionStorage('playerId', createHumanId())
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [playerNames, setPlayerNames] = useState<string[]>([])

  useEffect(() => {
    if (peer !== undefined) return
    const newPeer = new Peer(playerId)
    newPeer.on('error', (err) => {
      const peerError = err as PeerJSError
      console.log({ errorType: peerError.type, peer: { ...newPeer } })

      // retry connecting with new playerId
      if (peerError.type === 'unavailable-id') {
        newPeer.reconnect()
      }
    })
    newPeer.on('open', () => {
      console.log({ message: 'peer successfully created', peer: { ...newPeer } })
      setPeer(newPeer)
    })
  }, [playerId, peer, setPlayerId])

  // initiate peer connection
  // if all parameters are set
  useEffect(() => {
    if (lobbyId === undefined || peer === undefined) return
    console.log(`connecting to ${lobbyId}`, { peer: { ...peer } })
    const conn = peer.connect(lobbyId)
    conn.on('data', (data) => {
      console.log({ data })
    })
    conn.on('open', () => {
      console.log(`connection to host ${conn.peer} opened`)
    })
    conn.on('close', () => {
      console.log(`connection to host ${conn.peer} closed`)
    })
  }, [lobbyId, peer, setPlayerId])

  return {
    lobbyId,
    playerId,
    playerNames,
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
