import { css } from '@emotion/react'

export interface Card {
  value: number
  color: 'pink' | 'beige' | 'blue' | 'red'
}

export default function GameCard({ value, color, ...props }: Card) {
  return (
    <div css={styles.card(color)} {...props}>
      <span>{value}</span>
      <span>{value}</span>
      <span>{value}</span>
      <span>{value}</span>
    </div>
  )
}

const styles = {
  card: (color: string) => css`
    background-color: ${color};
    border: 14px solid white;
    border-radius: 16px;
    padding: 4px 14px;
    max-width: 250px;
    aspect-ratio: 0.65;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    justify-content: space-between;
    align-content: space-between;
    -webkit-text-stroke: 2px white;

    font-size: 4em;

    span:nth-child(3),
    span:nth-child(4) {
      transform: rotate(180deg);
    }
  `,
}
