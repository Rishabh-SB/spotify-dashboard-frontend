'use client';
eslint-disable react/display-name

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap } from 'recharts';
import { formatDuration } from '../lib/data';

const COLORS = [
    "#374151", // Slate gray
    "#4B5563", // Charcoal gray
    "#1E3A8A", // Dark indigo
    "#7C2D12", // Burnt umber
    "#065F46", // Deep teal green
    "#6D28D9", // Muted violet
    "#92400E", // Brownish amber
    "#155E75", // Dark cyan
    "#78350F", // Earthy bronze
    "#312E81", // Indigo navy
  ];

// Utility: truncate long labels
const truncateLabel = (label, maxLen = 12) => {
  if (!label) return '';
  return label.length > maxLen ? label.slice(0, maxLen) + '…' : label;
};

// Shared custom tooltip for bar charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#333' }}>
          {label}
        </p>
        <p style={{ margin: '0', color: '#667eea' }}>
          Playtime: {formatDuration(payload[0].value)}
        </p>
        <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>
          Raw value: {payload[0].value} minutes
        </p>
      </div>
    );
  }
  return null;
};

// Generic Bar Chart
const ChartWrapper = ({ title, data, color }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>{title}</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem', textAlign: 'center' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#666' }}
            height={50}
            tickFormatter={(val) => truncateLabel(val, 12)}
            interval={0}
            axisLine={{ stroke: '#999', strokeWidth: 1 }}
            tickLine={{ stroke: '#999', strokeWidth: 1 }}
          />
          <YAxis
            tickFormatter={(value) => formatDuration(value)}
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#999', strokeWidth: 1 }}
            tickLine={{ stroke: '#999', strokeWidth: 1 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="playtime" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Tooltip for Treemap
const CustomTreemapTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, size, rank } = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '0.9rem',
        color: '#333'
      }}>
        <strong>#{rank} {name}</strong>
        <p style={{ margin: '4px 0 0' }}>Playtime: {formatDuration(size)}</p>
      </div>
    );
  }
  return null;
};

// Custom renderer for each treemap node
const TreemapNode = React.memo(({ x, y, width, height, name, color }) => {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} stroke="#fff" />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {name}
        </text>
      )}
    </g>
  );
});

// Favorite Artists Treemap
const FavoriteArtistsTreemap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Favorite Artists</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No artist data available
        </div>
      </div>
    );
  }

  const treemapData = data.map((artist, index) => ({
    name: artist.name,
    size: artist.playtime,
    color: COLORS[index % COLORS.length],
    rank: index + 1
  }));

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem', textAlign: 'center' }}>Favorite Artists</h3>
      <ResponsiveContainer width="100%" height={380}>
        <Treemap
          data={treemapData}
          dataKey="size"
          stroke="#fff"
          content={<TreemapNode />}
          isAnimationActive={false}
        >
          <Tooltip content={<CustomTreemapTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

// Main Section1Charts component
export default function Section1Charts({ data }) {
  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        No data available for Section 1
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
      
      {/* Row: Songs + Albums side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <ChartWrapper title="Top 10 Songs by Playtime" data={data.topSongs} color="#667eea" />
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <ChartWrapper title="Top 10 Albums by Playtime" data={data.topAlbums} color="#f093fb" />
        </div>
      </div>

      {/* Bottom: Favorite Artists full width */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <FavoriteArtistsTreemap data={data.topArtists} />
      </div>
    </div>
  );
}
