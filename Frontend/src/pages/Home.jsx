import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-xl">
            ♫
          </span>
          <span>Spotify</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/artist/dashboard"
            className="text-neutral-400 hover:text-[#1DB954] font-semibold text-sm transition-colors hidden sm:inline-block"
          >
            For Artists
          </Link>
          <Link
            to="/register"
            className="text-neutral-400 hover:text-white font-semibold text-sm transition-colors"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-neutral-200 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 max-w-2xl">
          Music for everyone.
        </h1>
        <p className="text-neutral-400 text-lg sm:text-xl max-w-xl mb-8">
          Millions of songs. No credit card needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-8 py-3.5 rounded-full text-base tracking-wide transition-all duration-200 shadow-lg hover:scale-105"
          >
            Get Spotify Free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-200"
          >
            Log In
          </Link>
          <Link
            to="/artist/dashboard"
            className="w-full sm:w-auto text-neutral-400 hover:text-white font-semibold text-sm transition-colors py-2 underline underline-offset-4"
          >
            Artist Dashboard →
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
