export const isDev = location.href.includes('localhost')
export const domainName = isDev ? 'http://192.168.178.137:3000' : ''
