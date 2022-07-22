import { Fragment, useState } from 'react'
import { GameClientContextProvider } from './context/game-client-context'
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
      {gameMode === 'client' && lobbyId !== undefined && (
        <GameClientContextProvider lobbyId={lobbyId}>
          <JoinLobby onSessionFailed={() => setGameMode(undefined)} />
        </GameClientContextProvider>
      )}
    </Fragment>
  )
}
