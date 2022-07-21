export interface Message {
  type: 'join' | 'leave'
  id: string
}

export interface MessageJoin extends Message {
  type: 'join'
}

export interface LeaveMessage extends Message {
  type: 'leave'
}
