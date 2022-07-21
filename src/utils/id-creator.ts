import humanId from 'human-id'

export function createHumanId() {
  return humanId({
    separator: '-',
    capitalize: false,
  })
}
