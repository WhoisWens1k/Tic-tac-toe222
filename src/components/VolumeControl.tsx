import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';

interface VolumeControlProps {
  initialVolume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ initialVolume, onVolumeChange }) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    // Initialize with the current volume
    setVolume(initialVolume);
  }, [initialVolume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume);
    
    // If we're adjusting volume from zero, also unmute
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      soundManager.unmute();
    }
    
    // Play a sound to demonstrate the new volume
    if (newVolume > 0) {
      soundManager.play('click');
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (newMuteState) {
      soundManager.mute();
    } else {
      soundManager.unmute();
      // Play a sound to indicate unmuting
      soundManager.play('click');
    }
  };

  return (
    <div className="volume-control">
      <button 
        className="volume-button" 
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted || volume === 0 ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : volume < 0.5 ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M11.54 5.46A10 10 0 0 1 21 12a10 10 0 0 1-2.54 6.53"></path>
            <path d="M6.2 6.2l-2.31 2.31a1 1 0 0 0 0 1.41l2.31 2.3a1 1 0 0 0 1.42 0l8.46-8.46a1 1 0 0 0 0-1.42l-2.3-2.3a1 1 0 0 0-1.42 0L6.2 6.2z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
        aria-label="Volume"
      />
      <span className="volume-value">{Math.round(volume * 100)}%</span>
    </div>
  );
};

export default VolumeControl; 