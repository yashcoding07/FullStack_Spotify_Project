import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { musicApi } from "../config/api";
import { usePlayer } from "../context/usePlayer";
import Navbar from "../components/Navbar";

const Home = () => {
  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [musicsRes, playlistsRes] = await Promise.all([
          musicApi.get("/"),
          musicApi.get("/playlist"),
        ]);

        const musicList = musicsRes.data?.musics || [];
        const playlistList = Array.isArray(playlistsRes.data)
          ? playlistsRes.data
          : playlistsRes.data?.playlists || [];

        setMusics(musicList);
        setPlaylists(playlistList);
      } catch (err) {
        console.error("Failed to fetch home content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMusics = musics.filter((m) =>
    (m.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.artist || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = playlists.filter((p) =>
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.artist || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-24">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Hero & Search Header */}
        <section className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#181818] p-6 sm:p-10 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-black tracking-widest text-[#1DB954]">
              Spotify Web Player
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Music for everyone.
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-md">
              Stream millions of songs and explore curated playlists anytime, anywhere.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M10 18a7.952 7.952 0 004.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0018 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search songs or playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-800/90 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              />
            </div>
          </div>
        </section>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <svg className="animate-spin w-8 h-8 text-[#1DB954]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Loading music library...</p>
          </div>
        ) : (
          <>
            {/* Playlists Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Featured Playlists
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Curated collections for every mood
                  </p>
                </div>
                {playlists.length > 0 && (
                  <span className="text-xs font-semibold text-neutral-500">
                    {filteredPlaylists.length} playlists
                  </span>
                )}
              </div>

              {filteredPlaylists.length === 0 ? (
                <div className="bg-[#181818] p-8 rounded-xl border border-neutral-800 text-center text-neutral-400">
                  <p className="text-sm">No playlists found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredPlaylists.map((pl) => {
                    const firstTrack = pl.musics?.[0];
                    const cover =
                      firstTrack?.coverImageUrl ||
                      pl.coverImageUrl ||
                      null;

                    return (
                      <Link
                        key={pl._id}
                        to={`/playlist/${pl._id}`}
                        className="bg-[#181818] hover:bg-neutral-800/80 p-3.5 sm:p-4 rounded-xl border border-neutral-800/80 transition-all duration-200 group flex flex-col shadow-md hover:shadow-xl"
                      >
                        <div className="relative aspect-square w-full rounded-lg bg-neutral-900 overflow-hidden mb-3 flex items-center justify-center border border-neutral-800">
                          {cover ? (
                            <img
                              src={cover}
                              alt={pl.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-4xl font-bold text-neutral-600">♫</span>
                          )}

                          {/* Quick play overlay */}
                          {firstTrack && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                playTrack(firstTrack, pl.musics);
                              }}
                              className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl hover:scale-110"
                              title="Play Playlist"
                            >
                              <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-white truncate">
                          {pl.title}
                        </h3>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          By {pl.artist}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-2 font-mono">
                          {pl.musics?.length || 0} {(pl.musics?.length || 0) === 1 ? "track" : "tracks"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Popular Tracks Section */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Songs & Releases
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click any song to play immediately
                  </p>
                </div>
                {musics.length > 0 && (
                  <span className="text-xs font-semibold text-neutral-500">
                    {filteredMusics.length} songs
                  </span>
                )}
              </div>

              {filteredMusics.length === 0 ? (
                <div className="bg-[#181818] p-8 rounded-xl border border-neutral-800 text-center text-neutral-400">
                  <p className="text-sm">No tracks found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredMusics.map((track) => {
                    const isCurrent =
                      (currentTrack?._id || currentTrack?.id) ===
                      (track._id || track.id);

                    return (
                      <div
                        key={track._id}
                        onClick={() => playTrack(track, filteredMusics)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${
                          isCurrent
                            ? "bg-[#1DB954]/10 border-[#1DB954] ring-1 ring-[#1DB954]"
                            : "bg-[#181818] border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/70"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {track.coverImageUrl ? (
                            <img
                              src={track.coverImageUrl}
                              alt={track.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-neutral-500 flex-shrink-0">
                              ♫
                            </div>
                          )}

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isCurrent ? "text-[#1DB954]" : "text-white"
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        {/* Play Indicator */}
                        <div className="flex-shrink-0 pl-2">
                          <button
                            type="button"
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              isCurrent && isPlaying
                                ? "bg-[#1DB954] text-black scale-100"
                                : "bg-neutral-800 text-white opacity-0 group-hover:opacity-100 group-hover:bg-[#1DB954] group-hover:text-black"
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
