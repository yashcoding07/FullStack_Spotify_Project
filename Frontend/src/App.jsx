import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import Player from './components/Player'

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="min-h-screen bg-[#121212] text-white selection:bg-[#1DB954] selection:text-black">
          <AppRoutes />
          <Player />
        </div>
      </PlayerProvider>
    </AuthProvider>
  )
}

export default App
