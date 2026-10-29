import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { musicApi } from "../config/api";
import { usePlayer } from "../context/usePlayer";
import Navbar from "../components/Navbar";

const ArtistDashboard = () => {
  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [musicResponse, playlistResponse] = await Promise.all([
          musicApi.get("/artist-musics"),
          // Fetch playlists created by this artist, fallback to all if needed
          musicApi.get("/playlist?mine=true"),
        ]);

        const musicList = musicResponse.data?.musics || [];
        const playlistList = Array.isArray(playlistResponse.data)
          ? playlistResponse.data
          : playlistResponse.data?.playlists || [];

        setMusics(musicList);
        setPlaylists(playlistList);
      } catch (error) {
        console.error("Failed to load artist dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-24">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-neutral-800 text-[#1DB954] px-2.5 py-1 rounded-full border border-neutral-700">
                Creator Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
              Artist Dashboard
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mt-1">
              Manage your releases, view playlists, and upload tracks.
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
          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800 shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Tracks
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              {musics.length}
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">Uploaded to library</p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800 shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Playlists
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              {playlists.length}
            </p>
            <p className="text-xs text-neutral-400 mt-1 font-medium">Curated collections</p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800 shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Monthly Listeners
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              24.5K
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">+15.3% growth</p>
          </div>

          <div className="bg-[#181818] p-5 rounded-xl border border-neutral-800 shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Streams
            </p>
            <p className="text-2xl sm:text-3xl font-black mt-2 text-white">
              182.9K
            </p>
            <p className="text-xs text-[#1DB954] mt-1 font-medium">Across all platforms</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <svg className="animate-spin w-8 h-8 text-[#1DB954]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Loading artist content...</p>
          </div>
        ) : (
          <>
            {/* Playlists Section with Full Details */}
            <section className="bg-[#181818] rounded-xl border border-neutral-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Your Playlists</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Collections created under your artist profile
                  </p>
                </div>
                <Link
                  to="/artist/create-playlist"
                  className="text-xs text-[#1DB954] hover:underline font-semibold"
                >
                  + Create Playlist
                </Link>
              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-10 bg-neutral-900/60 rounded-xl border border-neutral-800/80">
                  <p className="text-neutral-400 text-sm font-medium">
                    No playlists created yet.
                  </p>
                  <Link
                    to="/artist/create-playlist"
                    className="inline-block mt-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs px-4 py-2 rounded-full transition-transform hover:scale-105"
                  >
                    Create Your First Playlist
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {playlists.map((pl) => {
                    const tracks = pl.musics || [];
                    const firstTrack = tracks[0];
                    const cover = firstTrack?.coverImageUrl || null;

                    return (
                      <div
                        key={pl._id}
                        className="bg-neutral-900/90 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0 border border-neutral-700/60 shadow">
                              {cover ? (
                                <img
                                  src={cover}
                                  alt={pl.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl font-bold text-neutral-600">♫</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/playlist/${pl._id}`}
                                className="font-bold text-sm text-white hover:text-[#1DB954] truncate block transition-colors"
                              >
                                {pl.title}
                              </Link>
                              <p className="text-xs text-neutral-400 truncate mt-0.5">
                                By {pl.artist}
                              </p>
                              <span className="inline-block mt-1 text-[11px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded-full">
                                {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
                              </span>
                            </div>
                          </div>

                          {/* Tracks Preview list */}
                          {tracks.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-400">
                              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                                Included Tracks:
                              </p>
                              {tracks.slice(0, 3).map((song, i) => (
                                <div
                                  key={song._id || i}
                                  className="flex items-center justify-between text-neutral-300 py-0.5 truncate"
                                >
                                  <span className="truncate">
                                    {i + 1}. {song.title || "Untitled"}
                                  </span>
                                  {song.musicUrl && (
                                    <button
                                      type="button"
                                      onClick={() => playTrack(song, tracks)}
                                      className="text-[#1DB954] hover:underline text-[11px] flex-shrink-0 ml-2"
                                    >
                                      Play
                                    </button>
                                  )}
                                </div>
                              ))}
                              {tracks.length > 3 && (
                                <p className="text-[11px] text-neutral-500 italic pt-1">
                                  +{tracks.length - 3} more tracks...
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                          <Link
                            to={`/playlist/${pl._id}`}
                            className="text-xs font-semibold text-[#1DB954] hover:underline"
                          >
                            View Playlist →
                          </Link>

                          {firstTrack && (
                            <button
                              type="button"
                              onClick={() => playTrack(firstTrack, tracks)}
                              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                            >
                              ▶ Play
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Releases Section */}
            <section className="bg-[#181818] rounded-xl border border-neutral-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Your Releases</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    All tracks uploaded to ImageKit & your catalog
                  </p>
                </div>
                <Link
                  to="/artist/upload-music"
                  className="text-xs text-[#1DB954] hover:underline font-semibold"
                >
                  + Upload Track
                </Link>
              </div>

              {musics.length === 0 ? (
                <div className="text-center py-10 bg-neutral-900/60 rounded-xl border border-neutral-800/80">
                  <p className="text-neutral-400 text-sm font-medium">
                    No songs uploaded yet.
                  </p>
                  <Link
                    to="/artist/upload-music"
                    className="inline-block mt-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs px-4 py-2 rounded-full transition-transform hover:scale-105"
                  >
                    Upload Your First Track
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {musics.map((track) => {
                    const isCurrent =
                      (currentTrack?._id || currentTrack?.id) ===
                      (track._id || track.id);

                    return (
                      <div
                        key={track._id}
                        onClick={() => playTrack(track, musics)}
                        className={`py-3 px-3 flex items-center justify-between rounded-lg cursor-pointer transition-colors group ${
                          isCurrent
                            ? "bg-[#1DB954]/10 text-[#1DB954]"
                            : "hover:bg-neutral-900/70 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {track.coverImageUrl ? (
                            <img
                              src={track.coverImageUrl}
                              alt={track.title}
                              className="w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow-md"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-neutral-500 flex-shrink-0">
                              ♫
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">
                              {track.artist || "Unknown Artist"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <button
                            type="button"
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isCurrent && isPlaying
                                ? "bg-[#1DB954] text-black"
                                : "bg-neutral-800 text-white group-hover:bg-[#1DB954] group-hover:text-black"
                            }`}
                            title="Play"
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

export default ArtistDashboard;
