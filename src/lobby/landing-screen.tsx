import { css } from '@emotion/react'
import { useState } from 'react'
import { useGameContext } from '../context/game-context'

interface LandingScreenProps {}

export function LandingScreen({ ...props }: LandingScreenProps) {
  const { createLobby, joinGame } = useGameContext()
  const [lobbyInput, setLobbyInput] = useState('')

  function handleClickJoinButton() {
    if (lobbyInput.length === 0) return
    joinGame(lobbyInput)
  }

  return (
    <div css={styles.landingScreen} {...props}>
      <h1>play levels</h1>
      <label htmlFor="join-button" hidden={true}>
        Join an existing game
      </label>
      <label htmlFor="lobby-input" hidden={true}>
        Enter a lobby id
      </label>
      <label htmlFor="host-button" hidden={true}>
        Host a new game
      </label>
      <div css={styles.joinInputButton}>
        <input
          type="text"
          name="lobby-input"
          placeholder="Lobby ID"
          value={lobbyInput}
          onChange={(event) => setLobbyInput(event.target.value)}
        />
        <button name="join-button" onClick={() => handleClickJoinButton()}>
          join
        </button>
      </div>
      <button name="host" onClick={() => createLobby()}>
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
