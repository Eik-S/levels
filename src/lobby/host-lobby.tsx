import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useGameHostContext } from '../context/game-host-context'
import { useNavigate } from 'react-router-dom'

export function HostLobby() {
  const [waitingDots, setWaitingDots] = useState('')
  const [isLobbyNameInClipboard, setIsLobbyNameInClipboard] = useState(false)

  const navigate = useNavigate()
  const { players, lobbyId, messagePlayer } = useGameHostContext()

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingDots((prevDots) => (prevDots.length === 3 ? '.' : prevDots + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  function saveLobbyIdToClipboard() {
    if (lobbyId === undefined) return
    navigator.clipboard.writeText(lobbyId)
    setIsLobbyNameInClipboard(true)
  }

  function startGame() {
    players.forEach((player) => {
      messagePlayer(
        {
          type: 'gameStateChanged',
          gameState: 'running',
        },
        player.id,
      )
    })

    navigate('/host/table')
  }

  return (
    <div>
      <h1>
        Session name:
        <br />
        <span
          css={styles.lobbyName(isLobbyNameInClipboard)}
          onClick={() => saveLobbyIdToClipboard()}
        >
          {lobbyId}
        </span>
      </h1>
      {players.length === 0 ? (
        <p>Waiting for other players{waitingDots}</p>
      ) : (
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.id}</li>
          ))}
        </ul>
      )}
      <button onClick={startGame}>start game</button>
    </div>
  )
}

const styles = {
  lobbyName: (copied: boolean) => css`
    cursor: copy;
    ${copied &&
    css`
      cursor: default;
    `}
  `,
}
