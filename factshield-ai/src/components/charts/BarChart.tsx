import React, { useEffect, useRef } from 'react';

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  color = 'var(--color-primary)'
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
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values
    const yValues = data.map(d => Number(d[yKey]));
    const minY = Math.min(0, ...yValues); // Start from 0 or the minimum value
    const maxY = Math.max(...yValues);
    const yRange = maxY - minY;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    chartRef.current.appendChild(svg);

    // Create group for chart elements
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    svg.appendChild(g);

    // Create x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', chartHeight.toString());
    xAxis.setAttribute('x2', chartWidth.toString());
    xAxis.setAttribute('y2', chartHeight.toString());
    xAxis.setAttribute('stroke', 'var(--color-neutral-300)');
    g.appendChild(xAxis);

    // Create y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '0');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '0');
    yAxis.setAttribute('y2', chartHeight.toString());
    yAxis.setAttribute('stroke', 'var(--color-neutral-300)');
    g.appendChild(yAxis);

    // Create x-axis label
    if (xLabel) {
      const xLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xLabelElement.setAttribute('x', (chartWidth / 2).toString());
      xLabelElement.setAttribute('y', (chartHeight + padding.bottom - 10).toString());
      xLabelElement.setAttribute('text-anchor', 'middle');
      xLabelElement.setAttribute('fill', 'var(--color-neutral-600)');
      xLabelElement.setAttribute('font-size', '12px');
      xLabelElement.textContent = xLabel;
      g.appendChild(xLabelElement);
    }

    // Create y-axis label
    if (yLabel) {
      const yLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      yLabelElement.setAttribute('transform', `translate(-${padding.left - 10}, ${chartHeight / 2}) rotate(-90)`);
      yLabelElement.setAttribute('text-anchor', 'middle');
      yLabelElement.setAttribute('fill', 'var(--color-neutral-600)');
      yLabelElement.setAttribute('font-size', '12px');
      yLabelElement.textContent = yLabel;
      g.appendChild(yLabelElement);
    }

    // Create y-axis ticks and grid lines
    const numYTicks = 5;
    for (let i = 0; i <= numYTicks; i++) {
      const y = chartHeight - (i / numYTicks) * chartHeight;
      const value = minY + (i / numYTicks) * yRange;

      // Grid line
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', '0');
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', chartWidth.toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', 'var(--color-neutral-100)');
      gridLine.setAttribute('stroke-dasharray', '4,4');
      g.appendChild(gridLine);

      // Tick label
      const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickLabel.setAttribute('x', '-5');
      tickLabel.setAttribute('y', y.toString());
      tickLabel.setAttribute('text-anchor', 'end');
      tickLabel.setAttribute('dominant-baseline', 'middle');
      tickLabel.setAttribute('fill', 'var(--color-neutral-600)');
      tickLabel.setAttribute('font-size', '10px');
      tickLabel.textContent = Math.round(value).toLocaleString();
      g.appendChild(tickLabel);
    }

    // Calculate bar width
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    // Create bars and x-axis labels
    data.forEach((d, i) => {
      const x = (i / data.length) * chartWidth + barSpacing / 2;
      const barHeight = ((Number(d[yKey]) - minY) / yRange) * chartHeight;
      const y = chartHeight - barHeight;
      
      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');
      
      // Add hover effect
      rect.setAttribute('opacity', '0.8');
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('opacity', '1');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('opacity', '0.8');
      });
      
      g.appendChild(rect);
      
      // X-axis label
      const labelX = x + barWidth / 2;
      const labelY = chartHeight + 15;
      
      const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickLabel.setAttribute('x', labelX.toString());
      tickLabel.setAttribute('y', labelY.toString());
      tickLabel.setAttribute('text-anchor', 'middle');
      tickLabel.setAttribute('fill', 'var(--color-neutral-600)');
      tickLabel.setAttribute('font-size', '10px');
      
      // Truncate long labels
      let label = String(d[xKey]);
      if (label.length > 10) {
        label = label.substring(0, 8) + '...';
      }
      
      tickLabel.textContent = label;
      
      // Rotate labels if there are many bars
      if (data.length > 8) {
        tickLabel.setAttribute('transform', `rotate(-45, ${labelX}, ${labelY})`);
        tickLabel.setAttribute('text-anchor', 'end');
      }
      
      g.appendChild(tickLabel);
      
      // Value label on top of bar
      const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', (x + barWidth / 2).toString());
      valueLabel.setAttribute('y', (y - 5).toString());
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('fill', 'var(--color-neutral-700)');
      valueLabel.setAttribute('font-size', '10px');
      valueLabel.textContent = Number(d[yKey]).toLocaleString();
      
      // Only show value label if there's enough space
      if (barHeight > 25) {
        g.appendChild(valueLabel);
      }
    });

  }, [data, xKey, yKey, xLabel, yLabel, color]);

  return (
    <div ref={chartRef} className="w-full h-full"></div>
  );
};

export default BarChart;