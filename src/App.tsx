import { Fragment, useState } from 'react'
import { GameHostContextProvider } from './context/game-host-context'
import { HostLobby } from './lobby/host-lobby'
import { JoinLobby } from './lobby/join-lobby'
import { LandingScreen } from './lobby/landing-screen'

export function App() {
  const [gameMode, setGameMode] = useState<'host' | 'client' | undefined>(undefined)
  const [lobbyId, setLobbyId] = useState<string | undefined>(undefined)

  function handleJoinGame(lobbyId: string) {
    setGameMode('client')
    setLobbyId(lobbyId)
  }

  return (
    <Fragment>
      {gameMode === undefined && (
        <LandingScreen onHostGame={() => setGameMode('host')} onJoinGame={handleJoinGame} />
      )}
      {gameMode === 'host' && (
        <GameHostContextProvider>
          <HostLobby />
        </GameHostContextProvider>
      )}
      {/* TODO: rename to ClientLobby and use LobbyId in its own GameClientContextProvider */}
      {gameMode === 'client' && <JoinLobby />}
    </Fragment>
  )
}
