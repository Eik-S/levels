import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useGameHostContext } from '../context/game-host-context'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { domainName } from '../utils/config'

export function HostLobby() {
  const [waitingDots, setWaitingDots] = useState('')
  const [isLobbyNameInClipboard, setIsLobbyNameInClipboard] = useState(false)

  const navigate = useNavigate()
  const { players, lobbyId, messagePlayer } = useGameHostContext()
  const lobbyLink = `${domainName}/join/${lobbyId}/lobby`

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingDots((prevDots) => (prevDots.length === 3 ? '.' : prevDots + '.'))
    }, 800)
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
    <div css={styles.hostLobby}>
      <h1>Host Lobby</h1>
      <div>
        <label id="session-name">Session Name</label>
        <button
          css={styles.lobbyName(isLobbyNameInClipboard)}
          title="click to copy"
          aria-labelledby="session-name"
          onClick={() => saveLobbyIdToClipboard()}
        >
          {lobbyId}
        </button>
      </div>
      <QRCode value={lobbyLink} size={256} css={styles.qrCode} />
      <div css={styles.playersInfo}>
        <h2>Players</h2>
        {players.length === 0 && <p>waiting for players to join</p>}
        <ul>
          {players.map((player) => (
            <li css={styles.player} key={player.id}>
              {player.id}
            </li>
          ))}
        </ul>
      </div>
      <button css={styles.startButton} onClick={startGame} disabled={players.length === 0}>
        start game
      </button>
    </div>
  )
}

const styles = {
  startButton: css`
    &:not(:disabled) {
      cursor: pointer;
      background-color: pink;

      &:active {
        opacity: 0.7;
      }
    }
  `,
  qrCode: css`
    border: 5px solid var(--color-accent, black);
    padding: 6px;
  `,
  hostLobby: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    row-gap: 24px;
  `,
  playersInfo: css`
    border-radius: 12px;
    width: 100%;
    background-color: lightgray;
    padding: 16px 24px;

    h2 {
      margin-top: 6px;
    }

    ul {
      list-style: none;
    }
  `,
  player: css`
    padding-left: 24px;
    font-size: 22px;
    &::before {
      font-family: NotoEmoji;
      content: '😍';
      font-weight: bold;
      position: absolute;
      margin-left: -1.5em;
    }
  `,
  lobbyName: (copied: boolean) => css`
    cursor: copy;
    ${copied &&
    css`
      cursor: default;
    `}
  `,
}
