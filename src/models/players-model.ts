import { DataConnection } from 'peerjs'

export interface Player {
  id: string
}

export interface HostPlayer extends Player {
  connection: DataConnection
}
