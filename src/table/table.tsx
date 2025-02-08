import { css } from '@emotion/react'
import { GameCard } from '../card'
import { useGameHostContext } from '../context/game-host-context'
import { useGameState } from '../hooks/use-game-state'

export function Table() {
  const { players } = useGameHostContext()
  const { drawCard, movingPlayer, game, resetGame } = useGameState({ players })
  console.log({ game, drawCard, movingPlayer, players })
  const movingPlayerHand = game.hands[movingPlayer.id]

  return (
    <div css={styles.wrapper}>
      <div css={styles.buttonRow}>
        <button onClick={drawCard}>draw card</button>
        <button onClick={resetGame}>reset</button>
      </div>
      <div css={styles.cards}>
        {movingPlayerHand.map((card) => (
          <GameCard {...card} key={`${card.color}${card.value}`} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    row-gap: 36px;
  `,
  buttonRow: css`
    display: flex;
    column-gap: 24px;
  `,
  cards: css`
    display: flex;
  `,
}
