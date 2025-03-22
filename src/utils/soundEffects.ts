type SoundEffectName = 'click' | 'move' | 'win' | 'select' | 'error';

interface SoundManager {
  play: (sound: SoundEffectName) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unmute: () => void;
  isMuted: () => boolean;
}

class SoundEffect {
  private audio: HTMLAudioElement | null = null;
  private volume: number = 0.5;
  private muted: boolean = false;
  private soundMap: Record<SoundEffectName, string> = {
    click: '/sounds/click.mp3',
    move: '/sounds/move.mp3',
    win: '/sounds/win.mp3',
    select: '/sounds/select.mp3',
    error: '/sounds/error.mp3',
  };

  constructor() {
    // Initialize audio context when possible (on user interaction)
    document.addEventListener('click', () => {
      if (!this.audio) {
        this.preloadSounds();
      }
    }, { once: true });
  }

  private preloadSounds(): void {
    // Create a silent audio element to preload
    const silent = new Audio();
    silent.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJYQQAAgAAAA8C+L8RjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    silent.load();
    silent.play().catch(() => {});
  }

  play(sound: SoundEffectName): void {
    if (this.muted) return;
    
    try {
      const audio = new Audio(this.soundMap[sound]);
      audio.volume = this.volume;
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  mute(): void {
    this.muted = true;
  }

  unmute(): void {
    this.muted = false;
  }

  isMuted(): boolean {
    return this.muted;
  }
}

export const soundManager: SoundManager = new SoundEffect(); 