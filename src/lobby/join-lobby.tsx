import { useGameClientContext } from '../context/game-client-context'

interface JoinLobbyProps {}
export function JoinLobby({ ...props }: JoinLobbyProps) {
  const { players, lobbyId, peerConnectionState, tryToReconnect } = useGameClientContext()

  return (
    <div {...props}>
      <h1>{lobbyId}s lobby</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.id}</li>
        ))}
      </ul>
      {peerConnectionState === 'unavailable' && (
        <div>
          <p>Connection not possible</p>
          <button onClick={() => tryToReconnect()}>retry</button>
        </div>
      )}
    </div>
  )
}
