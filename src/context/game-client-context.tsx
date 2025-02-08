import { Peer, PeerErrorType } from 'peerjs'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Message } from '../models/message-model'
import { PeerConnection } from '../models/peer-connection-model'
import { Player } from '../models/players-model'
import { createHumanId } from '../utils/id-creator'

export interface PeerJSError extends Error {
  type: PeerErrorType
}

function useGameClient({ lobbyId }: { lobbyId: string }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [peerConnection, setPeerConnection] = useState<PeerConnection | undefined>(undefined)

  const navigate = useNavigate()

  // peer setup and error handling
  useEffect(() => {
    const peer = new Peer(createHumanId())
    peer.on('open', () => {
      setPeer(peer)
      setPeerConnection({
        state: 'connecting',
        peerId: lobbyId,
      })
    })
    peer.on('error', (error) => {
      const peerError = error as PeerJSError
      if (peerError.type === 'peer-unavailable') {
        setPeerConnection({
          state: 'unavailable',
          peerId: lobbyId,
        })
      }
      console.log({ peerError: peerError.type, peer })
    })

    return () => {
      peer.disconnect()
      peer.destroy()
    }
  }, [lobbyId])

  // peerConnection setup and error handling
  useEffect(() => {
    if (typeof peerConnection === 'undefined' || peerConnection.state !== 'connecting') {
      return
    }

    const connection = peer!.connect(lobbyId)

    connection.on('open', () => {
      setPeerConnection({
        state: 'connected',
        connection,
        peerId: lobbyId,
      })
      console.log({
        message: `connection opened ${connection.peer}`,
        connection: { ...connection },
      })
    })

    connection.on('error', (error) => {
      const connectionError = error as PeerJSError

      console.log({ connectionError: connectionError.type, peer, connection })
    })

    connection.on('data', (data) => {
      const message = data as Message
      if (message.type === 'playersStateChanged') {
        setPlayers(message.players)
      }

      if (message.type === 'gameStateChanged') {
        if (document.location.href.endsWith('lobby')) {
          navigate('./hand')
        }
      }
    })
  }, [peerConnection, peer, lobbyId, navigate])

  function tryToReconnect() {
    setPeerConnection({
      state: 'connecting',
      peerId: lobbyId,
    })
  }

  return {
    lobbyId,
    players,
    peerConnectionState: peerConnection?.state,
    tryToReconnect,
  }
}

const GameClientContext = createContext<ReturnType<typeof useGameClient> | undefined>(undefined)

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
