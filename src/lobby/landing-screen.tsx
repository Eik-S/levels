import { css } from '@emotion/react'
import { useState } from 'react'

interface LandingScreenProps {
  onHostGame: () => void
  onJoinGame: (lobbyName: string) => void
}

export function LandingScreen({ onJoinGame, onHostGame, ...props }: LandingScreenProps) {
  const [lobbyInput, setLobbyInput] = useState('')

  function handleClickJoinButton() {
    if (lobbyInput.length === 0) return
    onJoinGame(lobbyInput)
  }

  return (
    <div css={styles.landingScreen} {...props}>
      <h1>play levels</h1>
      <div css={styles.joinInputButton}>
        <label htmlFor="lobby-input" hidden={true}>
          Enter a lobby id
        </label>
        <input
          type="text"
          name="lobby-input"
          placeholder="Lobby ID"
          value={lobbyInput}
          onChange={(event) => setLobbyInput(event.target.value)}
        />

        <label htmlFor="join-button" hidden={true}>
          Join an existing game
        </label>
        <button name="join-button" onClick={() => handleClickJoinButton()}>
          join
        </button>
      </div>

      <label htmlFor="host-button" hidden={true}>
        Host a new game
      </label>
      <button name="host-button" onClick={() => onHostGame()}>
        host
      </button>
    </div>
  )
}

const styles = {
  landingScreen: css`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  `,
  joinInputButton: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 32px;

    input {
      height: 32px;
      font-size: 24px;
    }
  `,
}
