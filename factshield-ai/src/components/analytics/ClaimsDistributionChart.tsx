import React, { useEffect, useRef } from 'react';
import type { ClaimsDistributionPoint } from '../../types/analytics';

interface ClaimsDistributionChartProps {
  data: ClaimsDistributionPoint[];
}

const ClaimsDistributionChart: React.FC<ClaimsDistributionChartProps> = ({ data }) => {
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
    
    // Define colors for each category
    const colors = ['#10b981', '#f59e0b', '#ef4444'];
    
    // Calculate total for percentage
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Draw bars
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;
    
    data.forEach((item, index) => {
      const percentage = total > 0 ? item.count / total : 0;
      const barHeight = chartHeight * percentage;
      
      // Draw bar
      ctx.fillStyle = colors[index % colors.length];
      const x = padding + barSpacing * index + (barSpacing - barWidth) / 2;
      const y = height - padding - barHeight;
      
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.credibilityRange, x + barWidth / 2, height - padding + 15);
      
      // Draw count
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 10);
      
      // Draw percentage
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText(`${Math.round(percentage * 100)}%`, x + barWidth / 2, y - 25);
    });
    
    // Draw title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Claims by Credibility Range', width / 2, 20);
    
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

export default ClaimsDistributionChart;