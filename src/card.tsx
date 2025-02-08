import { css } from '@emotion/react'
import { Card } from './models/card-model'

export function GameCard({ value, color, ...props }: Card) {
  return (
    <div css={styles.card(color)} {...props}>
      <span>L</span>
      <span>V</span>
      <span>S</span>
      <span>L</span>
    </div>
  )
}

const styles = {
  card: (color: string) => css`
    max-width: 250px;
    min-width: 50px;
    background-color: ${color};
    border: 0.7rem solid var(--color-accent, black);
    border-radius: 16px;
    padding: 4px 14px;
    aspect-ratio: 0.65;
    margin: 150px;

    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    justify-content: space-between;
    align-content: space-between;
    -webkit-text-stroke: 2px white;

    font-size: 4em;
    text-transform: uppercase;

    span:nth-child(3),
    span:nth-child(4) {
      transform: rotate(180deg);
    }
  `,
}
