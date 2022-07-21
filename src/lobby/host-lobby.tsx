import { useEffect, useState } from 'react'
import { useGameContext } from '../context/game-context'

export function HostLobby() {
  const [waitingDots, setWaitingDots] = useState('')

  const { players, playerId } = useGameContext()

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingDots((prevDots) => (prevDots.length === 3 ? '.' : prevDots + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>
        Session name:
        <br />
        {playerId}
      </h1>
      {players.length === 0 ? (
        <p>Waiting for other players{waitingDots}</p>
      ) : (
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
