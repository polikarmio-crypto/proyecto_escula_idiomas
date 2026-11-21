'use client';

import React, { useState } from 'react';

export interface DonutItem {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

export interface DonutChartProps {
  data: DonutItem[];
  title?: string;
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
  showLegend?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  title,
  centerLabel = 'TOTAL',
  centerValue,
  size = 140,
  showLegend = true,
  className = '',
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = size * 0.38;
  const strokeWidth = size * 0.16;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  // Calculamos los offsets para cada segmento
  const segments = data.map((item, index) => {
    const percent = item.value / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...item,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      index,
    };
  });

  const activeItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {title && (
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#D4D4D0] dark:border-[#242B27]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {title}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
            N={total}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 min-h-0">
        {/* Gráfico SVG Central */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            {/* Círculo de Fondo */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-[#EAE8E1] dark:text-[#181E1B]"
            />

            {/* Segmentos del Donut */}
            {segments.map((seg) => {
              const isHovered = hoveredIndex === seg.index;
              return (
                <circle
                  key={seg.index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(seg.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* KPI Central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
            <span className="text-base sm:text-lg font-black font-mono leading-none tracking-tight text-[#111312] dark:text-[#F4F4F0] tabular-nums">
              {activeItem
                ? `${activeItem.percent}%`
                : centerValue !== undefined
                ? centerValue
                : total}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mt-0.5 truncate max-w-[85px]">
              {activeItem ? activeItem.label : centerLabel}
            </span>
          </div>
        </div>

        {/* Leyenda Compacta */}
        {showLegend && (
          <div className="flex-1 flex flex-col justify-center space-y-1.5 w-full min-w-0 pr-1">
            {segments.map((seg) => {
              const isHovered = hoveredIndex === seg.index;
              return (
                <div
                  key={seg.index}
                  onMouseEnter={() => setHoveredIndex(seg.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between text-xs font-mono py-0.5 px-1.5 rounded-xs transition-colors cursor-pointer ${
                    isHovered
                      ? 'bg-[#EAE8E1] dark:bg-[#181E1B] font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-[#181E1B]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 shrink-0 rounded-none"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="truncate text-zinc-700 dark:text-zinc-300 text-[11px]">
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className="text-[11px] font-bold text-[#111312] dark:text-[#F4F4F0] tabular-nums">
                      {seg.value}
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      ({seg.percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export interface BarTrendItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  highlight?: boolean;
  meta?: string;
}

export interface BarTrendChartProps {
  data: BarTrendItem[];
  title?: string;
  unit?: string;
  height?: number | string;
  className?: string;
}

export function BarTrendChart({
  data,
  title,
  unit = '',
  height = 140,
  className = '',
}: BarTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 10);
  const roundedMax = Math.ceil(maxValue / 10) * 10;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {title && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D4D4D0] dark:border-[#242B27]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {title}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
            MAX: {roundedMax} {unit}
          </span>
        </div>
      )}

      {/* Área del Gráfico de Barras */}
      <div className="flex-1 flex flex-col justify-end min-h-0 relative" style={{ height }}>
        {/* Líneas Guía de Fondo */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-[#D4D4D0] dark:border-[#242B27] w-full" />
          <div className="border-b border-dashed border-[#D4D4D0] dark:border-[#242B27] w-full" />
          <div className="border-b border-dashed border-[#D4D4D0] dark:border-[#242B27] w-full" />
          <div className="border-b border-solid border-[#D4D4D0] dark:border-[#242B27] w-full" />
        </div>

        {/* Barras Flexbox */}
        <div className="relative z-10 flex items-end justify-between gap-1.5 h-full pt-4 pb-1 px-1">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.value / roundedMax) * 100, 4);
            const isHovered = hoveredIndex === index;
            const barColor = item.color || (item.highlight ? '#F59E0B' : '#4D6B53');

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip en Hover */}
                {isHovered && (
                  <div className="absolute -top-7 px-1.5 py-0.5 bg-[#121614] text-white text-[10px] font-mono font-bold border border-[#F59E0B] shadow-md z-20 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                    {item.label}: {item.value} {unit}
                  </div>
                )}

                {/* Etiqueta de Valor Flotante */}
                <span
                  className={`text-[9px] font-mono tabular-nums mb-1 transition-opacity ${
                    isHovered
                      ? 'text-[#D97706] dark:text-[#F59E0B] font-bold opacity-100'
                      : 'text-zinc-500 opacity-70 group-hover:opacity-100'
                  }`}
                >
                  {item.value}
                </span>

                {/* Contenedor de la Barra */}
                <div className="w-full max-w-[28px] h-full flex items-end justify-center">
                  <div
                    className="w-full rounded-none transition-all duration-300 relative"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isHovered ? '#D97706' : barColor,
                    }}
                  >
                    {item.highlight && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#F59E0B]" />
                    )}
                  </div>
                </div>

                {/* Etiqueta del Eje X */}
                <span
                  className={`text-[9px] font-mono uppercase tracking-tight mt-1.5 truncate max-w-[50px] text-center transition-colors ${
                    isHovered
                      ? 'text-[#111312] dark:text-white font-bold'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
