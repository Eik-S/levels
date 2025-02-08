type Color = 'pink' | 'beige' | 'blue' | 'red'
type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'j' | 'q' | 'k' | 'a'

export interface Card {
  value: Value
  color: Color
}

function createSet(): Card[] {
  const values: Value[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k', 'a']
  const colors: Color[] = ['pink', 'beige', 'blue', 'red']

  return colors
    .map((color) => {
      return values.map((value) => {
        return {
          color,
          value,
        }
      })
    })
    .flat()
}

export function createMixedSet(): Card[] {
  const unshuffled = createSet()

  return unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
