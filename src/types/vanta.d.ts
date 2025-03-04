declare module 'vanta/dist/vanta.clouds.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function CLOUDS(options: VantaOptions): VantaEffect;
  
  export default CLOUDS;
}

declare module 'vanta/dist/vanta.birds.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function BIRDS(options: VantaOptions): VantaEffect;
  
  export default BIRDS;
}

declare module 'vanta/dist/vanta.fog.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function FOG(options: VantaOptions): VantaEffect;
  
  export default FOG;
}

declare module 'vanta/dist/vanta.net.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function NET(options: VantaOptions): VantaEffect;
  
  export default NET;
}

declare module 'vanta/dist/vanta.dots.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function DOTS(options: VantaOptions): VantaEffect;
  
  export default DOTS;
}

declare module 'vanta/dist/vanta.rings.min' {
  import { Object3D } from 'three';
  
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string | number;
    backgroundColor?: string | number;
    cloudColor?: string | number;
    speed?: number;
    THREE?: any;
    [key: string]: any;
  }
  
  interface VantaEffect {
    setOptions: (options: Partial<VantaOptions>) => void;
    resize: () => void;
    destroy: () => void;
  }
  
  function RINGS(options: VantaOptions): VantaEffect;
  
  export default RINGS;
} 