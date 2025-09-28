'use client';
eslint-disable react/display-name

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MetricCard = ({ title, value, subtitle, color = '#667eea' }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  }}>
    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1rem', fontWeight: '600' }}>{title}</h4>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, marginBottom: '0.5rem' }}>
      {value}
    </div>
    {subtitle && <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>{subtitle}</p>}
  </div>
);

const SessionLengthHistogram = ({ data }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Session Length Histogram</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="range" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [value, 'Number of Sessions']}
          labelFormatter={(label) => `Duration Range: ${label}`}
        />
        <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default function Section5Charts({ data }) {
  return (
    <div>
      {/* Session Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <MetricCard 
          title="Total Sessions" 
          value={data.totalSessions.toLocaleString()} 
          subtitle="Total listening sessions"
          color="#667eea"
        />
        <MetricCard 
          title="Avg Session Duration" 
          value={`${data.avgSessionDuration.toLocaleString()}m`} 
          subtitle="Average session length"
          color="#764ba2"
        />
        <MetricCard 
          title="Avg Tracks Per Session" 
          value={data.avgTracksPerSession} 
          subtitle="Average tracks per session"
          color="#f093fb"
        />
      </div>

      <SessionLengthHistogram data={data.sessionLengthHistogram} />
    </div>
  );
}
