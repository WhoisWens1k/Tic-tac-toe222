import React, { useEffect } from 'react';
import VolumeControl from './VolumeControl';
import { soundManager } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  onClose: () => void;
  onSelectTheme: (theme: string) => void;
  currentTheme: string;
  soundVolume: number;
  onVolumeChange: (volume: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  onClose,
  onSelectTheme,
  currentTheme,
  soundVolume,
  onVolumeChange
}) => {
  const handleThemeChange = (theme: string) => {
    soundManager.play('click');
    onSelectTheme(theme);
  };

  const handleClose = () => {
    soundManager.play('click');
    onClose();
  };

  // Add escape key listener
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {true && (
          <motion.div 
            className="settings-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            key="settings-modal"
          >
            <motion.div 
              className="settings-content"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
              exit={{ y: -20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="close-button" onClick={handleClose} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <motion.h2 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              >
                Settings
              </motion.h2>
              
              <motion.div 
                className="settings-section"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
              >
                <h3>Volume</h3>
                <VolumeControl 
                  initialVolume={soundVolume}
                  onVolumeChange={onVolumeChange}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings; 