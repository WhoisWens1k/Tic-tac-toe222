import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  fadeSpeed: number;
}

interface ParticleBackgroundProps {
  count?: number;
  speed?: number;
  color1?: string;
  color2?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  count = 40, 
  speed = 0.5,
  color1 = '#00b4d8',
  color2 = '#bf3fff'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  
  // Create random particles
  const createParticles = (width: number, height: number, count: number) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 1;
      const useColor1 = Math.random() > 0.5;
      
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        color: useColor1 ? color1 : color2,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.5 + 0.2,
        fadeSpeed: Math.random() * 0.01 + 0.005
      });
    }
    
    return newParticles;
  };
  
  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && containerRef.current.parentElement) {
        const { offsetWidth, offsetHeight } = containerRef.current.parentElement;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setParticles(createParticles(dimensions.width, dimensions.height, count));
    }
  }, [dimensions, count, color1, color2]);
  
  // Animate particles
  useEffect(() => {
    if (!particles.length) return;
    
    const animate = () => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          let { x, y, vx, vy, opacity, fadeSpeed } = particle;
          
          // Update position
          x += vx;
          y += vy;
          
          // Update opacity with fade in and out
          opacity += fadeSpeed;
          if (opacity >= 0.7 || opacity <= 0.2) {
            fadeSpeed = -fadeSpeed;
          }
          
          // Wrap around edges
          if (x < -10) x = dimensions.width + 10;
          if (x > dimensions.width + 10) x = -10;
          if (y < -10) y = dimensions.height + 10;
          if (y > dimensions.height + 10) y = -10;
          
          return { ...particle, x, y, opacity, fadeSpeed };
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, dimensions]);
  
  return (
    <div className="particles-container" ref={containerRef}>
      {particles.map((particle, index) => (
        <div
          key={`particle-${index}`}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground; 