import React, { useEffect, useRef } from 'react';

interface PieChartProps {
  data: Array<Record<string, string | number>>;
  nameKey: string;
  valueKey: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  valueKey
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // In a real implementation, this would use a charting library like Chart.js or D3.js
    // For this mock, we'll create a simple SVG-based chart

    // Clear previous chart
    chartRef.current.innerHTML = '';

    if (data.length === 0) {
      chartRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-[var(--color-neutral-500)]">No data available</div>';
      return;
    }

    // Chart dimensions
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    chartRef.current.appendChild(svg);

    // Create group for chart elements
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${centerX}, ${centerY})`);
    svg.appendChild(g);

    // Calculate total value
    const total = data.reduce((sum, d) => sum + Number(d[valueKey]), 0);

    // Define colors
    const colors = [
      'var(--color-primary)',
      'var(--color-info)',
      'var(--color-success)',
      'var(--color-warning)',
      'var(--color-danger)',
      'var(--color-neutral-500)',
      'var(--color-primary-600)',
      'var(--color-info-600)',
      'var(--color-success-600)',
      'var(--color-warning-600)'
    ];

    // Create pie slices
    let startAngle = 0;
    data.forEach((d, i) => {
      const value = Number(d[valueKey]);
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate path
      const x1 = radius * Math.sin(startAngle);
      const y1 = -radius * Math.cos(startAngle);
      const x2 = radius * Math.sin(endAngle);
      const y2 = -radius * Math.cos(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', colors[i % colors.length]);
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '1');
      
      // Add hover effect
      path.setAttribute('opacity', '0.8');
      path.addEventListener('mouseenter', () => {
        path.setAttribute('opacity', '1');
        path.setAttribute('transform', `scale(1.05)`);
      });
      path.addEventListener('mouseleave', () => {
        path.setAttribute('opacity', '0.8');
        path.setAttribute('transform', '');
      });
      
      g.appendChild(path);
      
      // Add label
      const labelAngle = startAngle + angle / 2;
      const labelRadius = radius * 0.7;
      const labelX = labelRadius * Math.sin(labelAngle);
      const labelY = -labelRadius * Math.cos(labelAngle);
      
      const percentText = Math.round(percentage * 100) + '%';
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX.toString());
      label.setAttribute('y', labelY.toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '12px');
      label.setAttribute('font-weight', 'bold');
      label.textContent = percentText;
      
      // Only show percentage label if the slice is big enough
      if (percentage > 0.05) {
        g.appendChild(label);
      }
      
      startAngle = endAngle;
    });

    // Create legend
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', `translate(${width - 100}, 20)`);
    svg.appendChild(legendGroup);

    data.forEach((d, i) => {
      const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendItem.setAttribute('transform', `translate(0, ${i * 20})`);
      
      // Color box
      const colorBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      colorBox.setAttribute('width', '12');
      colorBox.setAttribute('height', '12');
      colorBox.setAttribute('fill', colors[i % colors.length]);
      legendItem.appendChild(colorBox);
      
      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '17');
      label.setAttribute('y', '10');
      label.setAttribute('font-size', '10px');
      label.setAttribute('fill', 'var(--color-neutral-700)');
      
      // Truncate long labels
      let labelText = String(d[nameKey]);
      if (labelText.length > 15) {
        labelText = labelText.substring(0, 12) + '...';
      }
      
      label.textContent = labelText;
      legendItem.appendChild(label);
      
      legendGroup.appendChild(legendItem);
    });

  }, [data, nameKey, valueKey]);

  return (
    <div ref={chartRef} className="w-full h-full"></div>
  );
};

export default PieChart;