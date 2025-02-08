import { Outlet, useParams } from 'react-router-dom'
import { GameClientContextProvider } from '../context/game-client-context'

export function LobbyWrapper() {
  const { lobbyId } = useParams()
  if (lobbyId === undefined) return null

  return (
    <GameClientContextProvider lobbyId={lobbyId}>
      <Outlet />
    </GameClientContextProvider>
  )
}
