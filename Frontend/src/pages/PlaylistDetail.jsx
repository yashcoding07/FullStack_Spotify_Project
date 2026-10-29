import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { musicApi } from "../config/api";
import { usePlayer } from "../context/usePlayer";
import Navbar from "../components/Navbar";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const res = await musicApi.get(`/playlist/${id}`);
        setPlaylist(res.data?.playlist || res.data);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setError("Playlist not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const tracks = playlist?.musics || [];

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-24">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to All Music
        </Link>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <svg className="animate-spin w-8 h-8 text-[#1DB954]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p>Loading playlist...</p>
          </div>
        ) : error || !playlist ? (
          <div className="py-16 text-center text-neutral-400">
            <p className="text-xl font-bold text-white mb-2">Error</p>
            <p className="text-sm">{error || "Could not load playlist."}</p>
          </div>
        ) : (
          <div>
            {/* Header / Hero */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-neutral-800/80 to-[#181818] p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-2xl mb-8">
              {/* Cover Art Mosaic / Placeholder */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
                {tracks[0]?.coverImageUrl ? (
                  <img
                    src={tracks[0].coverImageUrl}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-black text-neutral-600">♫</span>
                )}
              </div>

              {/* Meta */}
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1DB954]">
                  Playlist
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1 mb-3">
                  {playlist.title}
                </h1>
                <p className="text-sm text-neutral-400">
                  Created by <span className="text-white font-semibold">{playlist.artist}</span> •{" "}
                  <span>{tracks.length} {tracks.length === 1 ? "track" : "tracks"}</span>
                </p>

                {tracks.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePlayAll}
                    className="mt-5 inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-7 py-3 rounded-full transition-transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play All
                  </button>
                )}
              </div>
            </div>

            {/* Track List */}
            <div className="bg-[#181818] rounded-xl border border-neutral-800 p-4 sm:p-6 shadow-xl">
              <h2 className="text-lg font-bold mb-4">Tracks</h2>

              {tracks.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-8">
                  No tracks in this playlist yet.
                </p>
              ) : (
                <div className="divide-y divide-neutral-800/80">
                  {tracks.map((track, idx) => {
                    const isCurrent =
                      (currentTrack?._id || currentTrack?.id) ===
                      (track._id || track.id);

                    return (
                      <div
                        key={track._id || idx}
                        onClick={() => playTrack(track, tracks)}
                        className={`flex items-center justify-between py-3.5 px-3 rounded-lg cursor-pointer transition-colors group ${
                          isCurrent
                            ? "bg-[#1DB954]/10 text-[#1DB954]"
                            : "hover:bg-neutral-900/80 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="w-5 text-center text-xs font-mono text-neutral-500 group-hover:text-white">
                            {isCurrent && isPlaying ? "▶" : idx + 1}
                          </span>

                          {track.coverImageUrl ? (
                            <img
                              src={track.coverImageUrl}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover flex-shrink-0 shadow"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center font-bold text-neutral-500 flex-shrink-0">
                              ♫
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-[#1DB954] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all shadow"
                            title="Play"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlaylistDetail;
