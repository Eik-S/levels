import { css, Global } from '@emotion/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { GameHostContextProvider } from './context/game-host-context'
import { Hand } from './hand/hand'
import { HostLobby } from './lobby/host-lobby'
import { JoinLobby } from './lobby/join-lobby'
import { LandingScreen } from './lobby/landing-screen'
import { LobbyWrapper } from './lobby/lobby-wrapper'
import { Table } from './table/table'

const globalStyles = css`
  body {
    margin: 0;
    font-family:
      'Arial Rounded MT Bold',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    --color-main: white;
    --color-accent: black;
    background-color: var(--color-main, white);
    color: var(--color--accent, black);

    @media (prefers-color-scheme: dark) {
      --color-main: black;
      --color-accent: white;
      background-color: var(--color-main, black);
      color: var(--color-accent, white);
    }
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
  <>
    <Global styles={globalStyles} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route
          path="host"
          element={
            <GameHostContextProvider>
              <Outlet />
            </GameHostContextProvider>
          }
        >
          <Route path="lobby" element={<HostLobby />} />
          <Route path="table" element={<Table />} />
        </Route>
        <Route path="/join/:lobbyId" element={<LobbyWrapper />}>
          <Route path="lobby" element={<JoinLobby />} />
          <Route path="hand" element={<Hand />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>,
)
