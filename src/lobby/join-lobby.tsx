import { useEffect } from 'react'
import { useGameClientContext } from '../context/game-client-context'

interface JoinLobbyProps {
  onSessionFailed: () => void
}
export function JoinLobby({ onSessionFailed, ...props }: JoinLobbyProps) {
  const { lobbyId, sessionStatus, playerNames } = useGameClientContext()

  useEffect(() => {
    if (sessionStatus === 'failed') {
      onSessionFailed()
    }
  }, [onSessionFailed, sessionStatus])

  return (
    <div {...props}>
      <h1>{lobbyId}s lobby</h1>
      <ul>
        {playerNames.map((playerName, index) => (
          <li key={index}>{playerName}</li>
        ))}
      </ul>
    </div>
  )
}
