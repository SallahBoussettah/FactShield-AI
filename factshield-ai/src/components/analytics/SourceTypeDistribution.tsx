import React, { useEffect, useRef } from 'react';
import type { SourceTypeDistributionPoint } from '../../types/analytics';

interface SourceTypeDistributionProps {
  data: SourceTypeDistributionPoint[];
}

const SourceTypeDistribution: React.FC<SourceTypeDistributionProps> = ({ data }) => {
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
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Define colors for each source type
    const colors = {
      url: '#3b82f6',
      document: '#8b5cf6',
      text: '#ec4899'
    };
    
    // Calculate total for percentage
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Draw pie chart
    let startAngle = 0;
    
    data.forEach((item) => {
      const percentage = total > 0 ? item.count / total : 0;
      const sliceAngle = percentage * 2 * Math.PI;
      
      // Draw slice
      ctx.fillStyle = colors[item.type];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      
      // Draw slice border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;
      
      // Draw percentage label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(percentage * 100)}%`, labelX, labelY);
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = 20;
    let legendY = height - 80;
    
    data.forEach((item) => {
      // Draw color box
      ctx.fillStyle = colors[item.type];
      ctx.fillRect(legendX, legendY, 15, 15);
      
      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, legendY, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#111827';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} (${item.count})`,
        legendX + 25,
        legendY + 7.5
      );
      
      legendY += 25;
    });
    
    // Draw title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Source Type Distribution', centerX, 20);
    
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
        width={800} 
        height={300} 
        className="w-full h-64 rounded-lg"
      />
    </div>
  );
};

export default SourceTypeDistribution;