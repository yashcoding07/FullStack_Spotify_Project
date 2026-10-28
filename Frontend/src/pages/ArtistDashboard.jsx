import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ArtistDashboard = () => {
  const [musics, setmusics] = useState([
    {
      id: 1,
      title: "Midnight Waves",
      plays: "45,210",
      date: "Oct 24, 2026",
      duration: "3:45",
    },
    {
      id: 2,
      title: "Neon Horizon",
      plays: "32,150",
      date: "Oct 18, 2026",
      duration: "2:58",
    },
    {
      id: 3,
      title: "City Lights Serenade",
      plays: "18,900",
      date: "Oct 10, 2026",
      duration: "4:12",
    },
  ]);

  const [playlists, setplaylists] = useState([
    {
      id: "pl_001",
      title: "Late Night Vibes",
      artist: "The Midnight Echo",
      artistId: "art_101",
      musics: [
        {
          id: "m_001",
          title: "Moonlight Drive",
          duration: "3:45",
          coverImage: "https://picsum.photos/300?random=1",
        },
        {
          id: "m_002",
          title: "City Lights",
          duration: "4:12",
          coverImage: "https://picsum.photos/300?random=2",
        },
        {
          id: "m_003",
          title: "Silent Waves",
          duration: "2:58",
          coverImage: "https://picsum.photos/300?random=3",
        },
      ],
    },
  ]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [musicResponse, playlistResponse] = await Promise.all([
          axios.get("http://localhost:3002/api/music/artist-musics", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3002/api/music/playlist", {
            withCredentials: true,
          }),
        ]);

        setmusics(musicResponse.data.musics);
        console.log(musicResponse.data.musics);
        setplaylists(playlistResponse.data);
      } catch (error) {
        console.error("Failed to load artist dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-neutral-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
          >
            <span className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-xl">
              ♫
            </span>
            <span>Spotify</span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider bg-neutral-800 text-[#1DB954] px-2.5 py-1 rounded-full border border-neutral-700">
            For Artists
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/artist/dashboard"
            className="text-white font-semibold text-sm hover:text-[#1DB954] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/"
            className="text-neutral-400 font-semibold text-sm hover:text-white transition-colors"
          >
            Switch to Listener
          </Link>
          <Link
            to="/login"
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm px-4 py-2 rounded-full border border-neutral-700 transition-all duration-200"
          >
            Log out
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Artist Dashboard
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mt-1">
              Manage your releases, monitor stats, and organize your music.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/artist/upload-music"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:scale-105"
            >
              + Upload Music
            </Link>
            <Link
              to="/artist/create-playlist"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm px-4 py-2.5 rounded-full border border-neutral-700 transition-all duration-200"
            >
              + New Playlist
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Tracks
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              12
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">
              +2 uploaded this month
            </p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Playlists
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">4</p>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Curated collections
            </p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Monthly Listeners
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              24.5K
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">
              +15.3% vs last month
            </p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Streams
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              182.9K
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">
              Across all platforms
            </p>
          </div>
        </div>

        {/* Recent Uploads Section */}
        <section className="bg-[#181818] rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Releases</h2>
            <span className="text-xs text-neutral-400 font-medium">
              Latest uploads
            </span>
          </div>

          <div className="divide-y divide-neutral-800">
            {musics.map((track) => (
              <div
                key={track._id}
                className="py-3.5 flex items-center justify-between hover:bg-neutral-900/60 px-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center font-bold text-neutral-500">
                    <img src={track.coverImageUrl} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {track.title}
                    </p>
                    <p className="text-xs text-neutral-400">{track.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs sm:text-sm text-neutral-400">
                  <span className="hidden sm:inline">{track.plays} plays</span>
                  <span>{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-[#181818] rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Playlists</h2>
          </div>
          <div className="divide-y divide-neutral-800">
            {playlists.map((playlist) => (
              <div
                key={playlist._id || playlist.id}
                className="py-3.5 flex items-center justify-between hover:bg-neutral-900/60 px-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {playlist.title}
                    </p>
                    <p className="text-xs text-neutral-400">{playlist.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArtistDashboard;
