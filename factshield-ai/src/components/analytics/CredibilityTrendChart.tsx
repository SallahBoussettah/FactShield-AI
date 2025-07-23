import React, { useEffect, useRef } from 'react';
import type { CredibilityTrendPoint } from '../../types/analytics';

interface CredibilityTrendChartProps {
  data: CredibilityTrendPoint[];
}

const CredibilityTrendChart: React.FC<CredibilityTrendChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    const step = Math.ceil(data.length / 10);
    for (let i = 0; i < data.length; i += step) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels (dates)
    for (let i = 0; i < data.length; i += step) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const date = new Date(data[i].date);
      const label = `${date.getMonth() + 1}/${date.getDate()}`;
      
      ctx.fillText(label, x, height - padding + 15);
    }
    
    // Y-axis labels (credibility scores)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (chartHeight / 5) * i;
      const label = `${Math.round((i / 5) * 100)}%`;
      
      ctx.fillText(label, padding - 10, y + 3);
    }
    
    // Draw credibility line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - chartHeight * point.averageScore;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - chartHeight * point.averageScore;
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw point border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    });
    
    // Draw title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Credibility Score Trend', width / 2, 20);
    
  }, [data]);
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--color-neutral-50)] rounded-lg">
        <p className="text-[var(--color-neutral-500)]">No data available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300} 
        className="w-full h-64 rounded-lg"
      />
    </div>
  );
};

export default CredibilityTrendChart;