'use client';
/* eslint-disable react/display-name */

import { useState } from 'react';
import { 
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

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
        <p style={{ margin: 0, color: '#667eea' }}>
          Hours: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Weekly Line Chart
const WeeklyHoursChart = ({ data }) => (
  <div style={{ marginBottom: '2rem' }}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="week" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `Week ${value}`}
          angle={-45}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="hours" stroke="#f093fb" strokeWidth={2} dot={{ fill: '#f093fb', strokeWidth: 2, r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Monthly Line Chart
const MonthlyHoursChart = ({ data }) => (
  <div style={{ marginBottom: '2rem' }}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="hours" stroke="#764ba2" strokeWidth={2} dot={{ fill: '#764ba2', strokeWidth: 2, r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Hourly Radar Chart
const HourlyMinutesRadarChart = ({ data }) => {
  const radarData = data.map(item => ({
    hour: `${item.hour}:00`,
    minutes: Number(item.minutes) || 0
  }));

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem', textAlign: 'center' }}>Hourly Minutes Played (IST)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="hour" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fontSize: 12 }} />
          <Radar name="Minutes" dataKey="minutes" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  
  // Weekday Pie Chart
  const WeekdayMinutesPieChart = ({ data }) => {
    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b'];
  
    return (
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem', textAlign: 'center' }}>Weekday Hours Played</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="day"
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine={false}
              label={({ day, minutes }) => `${day}: ${formatMinutes(minutes)}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [formatMinutes(value), name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

// Main Component
export default function Section2Charts({ data }) {
  const [activeTab, setActiveTab] = useState('weekly');

  return (
    <div>
      {/* Tabs for Weekly and Monthly */}
<div style={{ display: 'flex', marginBottom: '1rem', gap: '1rem' }}>
  {['weekly', 'monthly'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        border: 'none',
        background: activeTab === tab ? '#667eea' : '#f0f0f0',
        color: activeTab === tab ? '#fff' : '#333',
        fontWeight: activeTab === tab ? 600 : 400,
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s'
      }}
    >
      {tab === 'weekly' ? 'Weekly Hours' : 'Monthly Hours'}
    </button>
  ))}
</div>

      <div>
        {activeTab === 'weekly' && <WeeklyHoursChart data={data.weeklyHours} />}
        {activeTab === 'monthly' && <MonthlyHoursChart data={data.monthlyHours} />}
      </div>

      {/* Side by side Hourly and Weekday charts */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <HourlyMinutesRadarChart data={data.hourlyMinutes} />
        <WeekdayMinutesPieChart data={data.weekdayMinutes} />
      </div>
    </div>
  );
}
