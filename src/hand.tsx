import { css } from '@emotion/react'
import GameCard, { Card } from './card'

interface HandProps {
  cards: Card[]
}
export function Hand({ cards }: HandProps) {
  return (
    <div css={styles.hand}>
      {cards.map((card, index) => (
        <GameCard key={index} color={card.color} value={card.value} />
      ))}
    </div>
  )
}

const styles = {
  hand: css`
    display: flex;
    flex-direction: column;
  `,
}
