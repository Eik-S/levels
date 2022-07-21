import { css } from '@emotion/react'
import { Card, CardProps } from './card'

interface HandProps {
  cards: CardProps[]
}
export function Hand({ cards }: HandProps) {
  return (
    <div css={styles.hand}>
      {cards.map((card, index) => (
        <Card key={index} color={card.color} value={card.value} />
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
