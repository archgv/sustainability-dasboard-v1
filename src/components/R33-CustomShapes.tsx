import React from 'react';

interface CustomShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
  shape: string;
  size?: number;
}

export const CustomShape: React.FC<CustomShapeProps> = ({ cx = 0, cy = 0, fill = '#000', shape, size = 12 }) => {
  const renderShape = () => {
    switch (shape) {
      case 'square':
        return (
          <rect
            x={cx - size / 2}
            y={cy - size / 2}
            width={size}
            height={size}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      
      case 'triangle':{
        const points = [
          [cx, cy - size / 2],
          [cx - size / 2, cy + size / 2],
          [cx + size / 2, cy + size / 2]
        ].map(p => p.join(',')).join(' ');
        return (
          <polygon
            points={points}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      }

      case 'star':{
        const outerRadius = size / 2;
        const innerRadius = outerRadius * 0.4;
        const starPoints = [];
        
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = cx + radius * Math.cos(angle - Math.PI / 2);
          const y = cy + radius * Math.sin(angle - Math.PI / 2);
          starPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={starPoints.join(' ')}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      }

      case 'circle':
        return (
          <circle
            cx={cx}
            cy={cy}
            r={size / 2}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      
      case 'diamond':{
        const diamondPoints = [
          [cx, cy - size / 2],
          [cx + size / 2, cy],
          [cx, cy + size / 2],
          [cx - size / 2, cy]
        ].map(p => p.join(',')).join(' ');
        return (
          <polygon
            points={diamondPoints}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      }

      case 'pentagon':{
        const pentagonPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = cx + (size / 2) * Math.cos(angle);
          const y = cy + (size / 2) * Math.sin(angle);
          pentagonPoints.push(`${x},${y}`);
        }
        return (
          <polygon
            points={pentagonPoints.join(' ')}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
      }
      
      default:
        return (
          <circle
            cx={cx}
            cy={cy}
            r={size / 2}
            fill={fill}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1}
          />
        );
    }
  };

  return renderShape();
};