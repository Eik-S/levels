import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useGameHostContext } from '../context/game-host-context'

export function HostLobby() {
  const [waitingDots, setWaitingDots] = useState('')
  const [isLobbyNameInClipboard, setIsLobbyNameInClipboard] = useState(false)

  const { players, lobbyId } = useGameHostContext()

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
          {players.map((player, index) => (
            <li key={index}>{player.id}</li>
          ))}
        </ul>
      )}
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
