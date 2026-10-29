import { usePlayer } from "../context/usePlayer";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-neutral-800 z-50 px-4 sm:px-6 flex items-center justify-between shadow-2xl">
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[140px]">
        {currentTrack.coverImageUrl ? (
          <img
            src={currentTrack.coverImageUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0 shadow-md"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center font-bold text-neutral-500 flex-shrink-0">
            ♫
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {currentTrack.title || "Unknown Title"}
          </p>
          <p className="text-xs text-neutral-400 truncate">
            {currentTrack.artist || "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="flex flex-col items-center justify-center max-w-xl w-2/4 px-2">
        {/* Buttons */}
        <div className="flex items-center gap-4 mb-1">
          <button
            type="button"
            onClick={prevTrack}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            title="Previous"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            title="Next"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-xs text-neutral-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <div
            className="relative flex-1 h-1.5 bg-neutral-700 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seek(ratio * duration);
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#1DB954] rounded-full group-hover:bg-[#1ed760]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[120px]">
        <button
          type="button"
          onClick={toggleMute}
          className="text-neutral-400 hover:text-white transition-colors"
          title="Mute / Unmute"
        >
          {volume === 0 ? (
            <svg className="w-5 h-5 fill-current text-red-400" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 sm:w-24 accent-[#1DB954] cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default Player;
