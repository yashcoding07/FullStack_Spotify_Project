/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useRef, useEffect } from "react";

export const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(new Audio());
  const nextTrackRef = useRef(() => {});

  const playTrack = (track, newQueue = null) => {
    if (!track?.musicUrl) return;

    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!queue.length || !currentTrack) return;
    const currentIndex = queue.findIndex(
      (t) => (t._id || t.id) === (currentTrack._id || currentTrack.id)
    );
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else if (queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const prevTrack = () => {
    if (!queue.length || !currentTrack) return;
    const currentIndex = queue.findIndex(
      (t) => (t._id || t.id) === (currentTrack._id || currentTrack.id)
    );
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    } else if (queue.length > 0) {
      playTrack(queue[queue.length - 1]);
    }
  };

  // Keep ref up to date to prevent stale closure
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextTrackRef.current();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrack?.musicUrl) {
      audio.src = currentTrack.musicUrl;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback error:", err);
          setIsPlaying(false);
        });
    }
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVol) => {
    const audio = audioRef.current;
    audio.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume: isMuted ? 0 : volume,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume: handleVolumeChange,
        toggleMute,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
