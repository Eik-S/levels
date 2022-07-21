import { Fragment, useState } from 'react'
import { useGameContext } from './context/game-context'
import { HostLobby } from './lobby/host-lobby'
import { JoinLobby } from './lobby/join-lobby'
import { LandingScreen } from './lobby/landing-screen'

export function App() {
  const { gameMode } = useGameContext()

  return (
    <Fragment>
      {gameMode === undefined && <LandingScreen />}
      {gameMode === 'host' && <HostLobby />}
      {gameMode === 'join' && <JoinLobby />}
    </Fragment>
  )
}
