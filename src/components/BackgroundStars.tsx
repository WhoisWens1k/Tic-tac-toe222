import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const BackgroundStars: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Colors for stars with a blue/cyan theme
  const starColors = [
    '#ffffff', // white
    '#e6f7ff', // very light blue
    '#b3e0ff', // light blue
    '#80caff', // medium blue
    '#4db8ff', // bright blue
    '#00b4d8', // cyan accent
  ];

  // Function to generate random stars
  const generateStars = (count: number, width: number, height: number) => {
    const newStars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 1;
      // Larger stars are less common and have more prominent effects
      const isLargeStar = size > 3;
      
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: size,
        opacity: Math.random() * 0.7 + (isLargeStar ? 0.5 : 0.2),
        duration: Math.random() * 8 + (isLargeStar ? 6 : 2),
        delay: Math.random() * 5,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
    return newStars;
  };

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (starsRef.current) {
        const { clientWidth, clientHeight } = document.documentElement;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    // Initial dimensions
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate stars when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      // Increase star density for a more vibrant night sky
      const starCount = Math.floor((dimensions.width * dimensions.height) / 6000);
      setStars(generateStars(starCount, dimensions.width, dimensions.height));
    }
  }, [dimensions]);

  // Add shooting stars
  const [shootingStars, setShootingStars] = useState<{x: number, y: number, angle: number}[]>([]);
  
  useEffect(() => {
    // Create a new shooting star every few seconds
    const interval = setInterval(() => {
      if (dimensions.width && dimensions.height) {
        const newShootingStar = {
          x: Math.random() * dimensions.width,
          y: Math.random() * (dimensions.height / 3), // Start in top third of screen
          angle: Math.random() * 30 + 30 // Angle between 30 and 60 degrees
        };
        
        setShootingStars(prev => [...prev.slice(-2), newShootingStar]); // Keep last 3 shooting stars max
      }
    }, 8000); // New shooting star every 8 seconds
    
    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div className="stars-background" ref={starsRef}>
      {/* Regular stars */}
      {stars.map((star, index) => (
        <div
          key={`star-${index}`}
          className="star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: star.size > 2.5 ? `0 0 ${star.size * 2}px ${star.color}` : 'none',
            opacity: 0,
            animation: `starTwinkle ${star.duration}s ease-in-out infinite ${star.delay}s`
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {shootingStars.map((shootingStar, index) => (
        <motion.div
          key={`shooting-${index}`}
          className="shooting-star"
          initial={{
            x: shootingStar.x,
            y: shootingStar.y,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: shootingStar.x + Math.cos(shootingStar.angle * Math.PI / 180) * dimensions.width * 0.7,
            y: shootingStar.y + Math.sin(shootingStar.angle * Math.PI / 180) * dimensions.height * 0.7,
            opacity: [0, 1, 0],
            scale: [0.2, 1, 0.2]
          }}
          transition={{
            duration: 2,
            times: [0, 0.3, 1],
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: 'white',
            borderRadius: '50%',
            zIndex: 0,
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.7), 0 0 20px 5px rgba(0, 180, 216, 0.5)',
          }}
        />
      ))}
      
      {/* Subtle glow in the background */}
      <div className="stars-glow" />
    </div>
  );
};

export default BackgroundStars; 