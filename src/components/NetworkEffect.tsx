import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAlt: boolean;
  size: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  opacity: number;
}

const NetworkEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const linesRef = useRef<Line[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  const [renderedNodes, setRenderedNodes] = useState<Node[]>([]);
  const [renderedLines, setRenderedLines] = useState<Line[]>([]);
  const lastUpdateRef = useRef<number>(0);
  
  // Generate random nodes
  const generateNodes = useCallback((width: number, height: number, count: number = 12) => {
    const newNodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      newNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        isAlt: Math.random() > 0.6,
        size: Math.random() * 1.5 + 2
      });
    }
    return newNodes;
  }, []);
  
  // Calculate lines between nodes
  const calculateLines = useCallback((nodes: Node[], maxDistance: number = 200) => {
    const newLines: Line[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);
          const angle = Math.atan2(dy, dx);
          newLines.push({
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            length: distance,
            angle,
            opacity
          });
        }
      }
    }
    
    return newLines;
  }, []);
  
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
  
  // Initialize nodes when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newNodes = generateNodes(dimensions.width, dimensions.height);
      nodesRef.current = newNodes;
      setRenderedNodes(newNodes);
      
      const newLines = calculateLines(newNodes);
      linesRef.current = newLines;
      setRenderedLines(newLines);
    }
  }, [dimensions, generateNodes, calculateLines]);
  
  // Animate nodes and recalculate lines
  useEffect(() => {
    if (!nodesRef.current.length) return;
    
    const animate = (timestamp: number) => {
      // Only update the UI every 50ms for better performance
      if (timestamp - lastUpdateRef.current > 50) {
        const { width, height } = dimensions;
        
        // Update node positions
        nodesRef.current.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;
          
          // Bounce off edges
          if (node.x <= 0 || node.x >= width) {
            node.vx = -node.vx;
            node.x = node.x <= 0 ? 0 : width;
          }
          
          if (node.y <= 0 || node.y >= height) {
            node.vy = -node.vy;
            node.y = node.y <= 0 ? 0 : height;
          }
        });
        
        // Recalculate lines
        linesRef.current = calculateLines(nodesRef.current);
        
        // Update state for rendering
        setRenderedNodes([...nodesRef.current]);
        setRenderedLines([...linesRef.current]);
        
        lastUpdateRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, calculateLines]);
  
  return (
    <div className="net-nodes" ref={containerRef}>
      {renderedNodes.map((node, index) => (
        <div
          key={`node-${index}`}
          className={`net-node ${node.isAlt ? 'alt' : ''}`}
          style={{
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${node.size}px`,
            height: `${node.size}px`
          }}
        />
      ))}
      
      {renderedLines.map((line, index) => (
        <div
          key={`line-${index}`}
          className="net-line"
          style={{
            left: `${line.x1}px`,
            top: `${line.y1}px`,
            width: `${line.length}px`,
            transform: `rotate(${line.angle}rad)`,
            opacity: line.opacity * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default NetworkEffect; 