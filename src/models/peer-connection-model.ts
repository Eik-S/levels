import { DataConnection } from 'peerjs'

interface PeerConnectionBase {
  state: 'connected' | 'disconnected' | 'unavailable' | 'connecting'
  peerId: string
}

interface PeerConntectionConnecting extends PeerConnectionBase {
  state: 'connecting'
}

interface PeerConntectionConnected extends PeerConnectionBase {
  state: 'connected'
  connection: DataConnection
}

interface PeerConnectionDisconnected extends PeerConnectionBase {
  state: 'disconnected'
}

interface PeerConnectionUnavailable extends PeerConnectionBase {
  state: 'unavailable'
}

export type PeerConnection =
  | PeerConntectionConnected
  | PeerConnectionDisconnected
  | PeerConnectionUnavailable
  | PeerConntectionConnecting
