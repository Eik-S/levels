import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { css, Global } from '@emotion/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LandingScreen } from './lobby/landing-screen'
import { GameHostContextProvider } from './context/game-host-context'
import { HostLobby } from './lobby/host-lobby'
import { GameClientContextProvider } from './context/game-client-context'
import { JoinLobby } from './lobby/join-lobby'
import { LobbyWrapper } from './lobby/lobby-wrapper'

const globalStyles = css`
  body {
    margin: 0;
    font-family: 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #000;
    color: white;
  }

  button {
    padding: 8px 16px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 24px;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 4px;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route
          path="/host/"
          element={
            <GameHostContextProvider>
              <HostLobby />
            </GameHostContextProvider>
          }
        />
        <Route path="/join/:lobbyId" element={<LobbyWrapper />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
