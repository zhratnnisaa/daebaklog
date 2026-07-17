"use client";

import { useState, useRef, useEffect } from "react";

interface Song {
  id: string;
  title: string;
  duration: number; // in seconds
  previewUrl: string | null;
}

interface SongPlayerProps {
  songs: Song[];
}

export function SongPlayer({ songs }: SongPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause toggle
  const togglePlay = (song: Song) => {
    if (!song.previewUrl) return;

    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(err => console.error(err));
        setIsPlaying(true);
      }
    } else {
      // Play new song
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.src = song.previewUrl;
        audioRef.current.load();
        audioRef.current.play().catch(err => console.error(err));
      }
    }
  };

  // Set up audio listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {/* CSS Bounce Animation */}
      <style jsx global>{`
        @keyframes bounceSimple {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-bounce-bar {
          animation: bounceSimple 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
      
      <div className="flex flex-col gap-2">
        {songs.map((song, index) => {
          const isSelected = currentSong?.id === song.id;
          const isThisPlaying = isSelected && isPlaying;
          return (
            <div
              key={song.id}
              onClick={() => song.previewUrl && togglePlay(song)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all duration-300 ${
                isSelected
                  ? "bg-emerald-950/40 border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.15)]"
                  : "bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-900"
              } ${!song.previewUrl ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-mono text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                
                {/* Play/Pause Button Indicator */}
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#39FF14] text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  disabled={!song.previewUrl}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double toggle
                    if (song.previewUrl) togglePlay(song);
                  }}
                >
                  {isThisPlaying ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <div>
                  <p className={`font-semibold text-sm ${isSelected ? "text-[#39FF14]" : "text-white"}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {song.previewUrl ? "Preview Audio tersedia" : "Tidak ada preview"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isThisPlaying && (
                  <div className="flex gap-0.5 items-end h-3 w-4 pb-0.5">
                    <span className="w-0.5 bg-[#39FF14] animate-bounce-bar h-full" style={{ animationDelay: "100ms" }} />
                    <span className="w-0.5 bg-[#39FF14] animate-bounce-bar h-2/3" style={{ animationDelay: "300ms" }} />
                    <span className="w-0.5 bg-[#39FF14] animate-bounce-bar h-4/5" style={{ animationDelay: "200ms" }} />
                  </div>
                )}
                <span className="text-gray-400 font-mono text-sm">
                  {formatTime(song.duration)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Glassmorphic Player at the bottom */}
      {currentSong && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-50 bg-black/85 backdrop-blur-xl border border-[#39FF14]/30 rounded-2xl p-4 shadow-[0_10px_35px_rgba(57,255,20,0.25)] animate-[slideUp_0.4s_ease-out]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="truncate">
              <p className="text-[10px] text-[#39FF14] font-black uppercase tracking-widest">Sekarang Diputar</p>
              <p className="text-white font-bold text-sm truncate">{currentSong.title}</p>
            </div>
            
            <button
              onClick={() => togglePlay(currentSong)}
              className="w-10 h-10 rounded-full bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_15px_#39FF14] cursor-pointer hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressBarChange}
              className="flex-1 accent-[#39FF14] h-1 bg-gray-800 rounded-lg cursor-pointer appearance-none"
            />
            <span className="text-[10px] text-gray-500 font-mono">{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
