import humanId from 'human-id'

export function createPlayerId() {
  return humanId({
    separator: '-',
    capitalize: false,
  })
}
