import React, { useEffect, useRef } from 'react';

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({
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
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values
    const yValues = data.map(d => Number(d[yKey]));
    const minY = Math.min(...yValues);
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
      xLabelElement.setAttribute('y', (chartHeight + padding.bottom - 5).toString());
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

    // Create x-axis ticks
    const numXTicks = Math.min(data.length, 7);
    const xTickInterval = Math.ceil(data.length / numXTicks);
    for (let i = 0; i < data.length; i += xTickInterval) {
      const x = (i / (data.length - 1)) * chartWidth;
      
      // Tick label
      const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickLabel.setAttribute('x', x.toString());
      tickLabel.setAttribute('y', (chartHeight + 15).toString());
      tickLabel.setAttribute('text-anchor', 'middle');
      tickLabel.setAttribute('fill', 'var(--color-neutral-600)');
      tickLabel.setAttribute('font-size', '10px');
      
      // Format date if it's a date string
      const value = String(data[i][xKey]);
      if (value.includes('-')) {
        const date = new Date(value);
        tickLabel.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        tickLabel.textContent = value;
      }
      
      g.appendChild(tickLabel);
    }

    // Create line path
    const pathData = data.map((d, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((Number(d[yKey]) - minY) / yRange) * chartHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    g.appendChild(path);

    // Create area path
    const areaPathData = pathData + ` L${chartWidth},${chartHeight} L0,${chartHeight} Z`;
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPath.setAttribute('d', areaPathData);
    areaPath.setAttribute('fill', color);
    areaPath.setAttribute('fill-opacity', '0.1');
    areaPath.setAttribute('stroke', 'none');
    g.insertBefore(areaPath, path);

    // Create data points
    data.forEach((d, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((Number(d[yKey]) - minY) / yRange) * chartHeight;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', 'white');
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);
    });

  }, [data, xKey, yKey, xLabel, yLabel, color]);

  return (
    <div ref={chartRef} className="w-full h-full"></div>
  );
};

export default LineChart;