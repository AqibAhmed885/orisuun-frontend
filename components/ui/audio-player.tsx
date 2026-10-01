'use client';

import {
  HighVolumeIcon,
  LowVolumeIcon,
  PauseButton,
  PlayButton,
  SoundWave,
  VolumeButton, // Icon for volume control
} from '@/public/icons/audio-icons';
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  fileName: string;
}

export function AudioPlayer({ src, fileName }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // Volume state (1 = 100%)
  const [isMuted, setIsMuted] = useState(false); // Mute state
  const [showVolumeControl, setShowVolumeControl] = useState(false); // Show slider
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const lowerVolume = () => {
    if (audioRef.current) {
      let newVolume = Math.max(0, audioRef.current.volume - 0.1); // Decrease by 10%
      audioRef.current.volume = newVolume;
      setVolume(newVolume); // Update state
    }
  };

  const increaseVolume = () => {
    if (audioRef.current) {
      let newVolume = Math.min(1, audioRef.current.volume + 0.1); // Increase by 10%
      audioRef.current.volume = newVolume;
      setVolume(newVolume); // Update state
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#F0F7FD] rounded-lg p-2 min-w-56 max-w-56 3xl:!min-w-max 3xl:!max-w-max">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={togglePlay}
          className=" "
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseButton /> : <PlayButton />}
        </button>

        <div
          ref={progressRef}
          className="relative flex-1 cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <SoundWave
            progress={currentTime / duration}
            className="transition-colors"
          />
        </div>

        <span className="text-sm text-nav-blue text-center">
          {formatTime(currentTime)}
        </span>

        {/* Volume Button and Slider */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            aria-label="Volume Control"
            className="cursor-pointer"
          >
            <VolumeButton />
          </button>
          {showVolumeControl && (
            <div className="absolute bottom-[calc(100%+12px)] speech-bubble left-0 ">
              <div
                style={{ transform: 'matrix(1, 0, 0, -1, 0, 0)' }}
                className=" relative w-[9.375rem] h-9 flex items-center bg-[#ECF3F9] p-1 gap-0.5 rounded shadow-custom after:shadow"
              >
                {/* Left Speaker Icon */}
                <button onClick={lowerVolume} aria-label="Mute">
                  <LowVolumeIcon />
                </button>

                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-omblue-600"
                  style={{
                    background: `linear-gradient(to right, #2C5FCC ${
                      volume * 100
                    }%, #C6C6C6 ${volume * 100}%)`,
                    borderColor: 'transparent',
                  }}
                  aria-label="Volume"
                />

                {/* Right Speaker Icon */}
                <button onClick={increaseVolume} aria-label="Unmute">
                  <HighVolumeIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}
