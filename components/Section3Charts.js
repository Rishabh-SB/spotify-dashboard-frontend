'use client';

import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f'];

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

const SkipRateGauge = ({ value }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Skip Rate</h3>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <div style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `conic-gradient(#667eea 0deg ${value * 3.6}deg, #f0f0f0 ${value * 3.6}deg 360deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {value}%
        </div>
      </div>
    </div>
  </div>
);

const TopStreaksChart = ({ data }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Top 5 Streaks</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="track" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [value, 'Streak Count']}
          labelFormatter={(label) => `Track: ${label}`}
        />
        <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const TrackPlaytimeHistogram = ({ data }) => {
    // Transform data: calculate mean of each range
    const processedData = data.map(item => {
      // Example range: "(0, 10000]"
      const match = item.range.match(/\((\d+),\s*(\d+)\]/);
      let mean = item.range; // fallback
      if (match) {
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        mean = Math.round((min + max) / 2 / 1000); // convert ms to minutes
      }
      return { ...item, mean };
    });
  
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Track Playtime Histogram</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mean" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
              label={{ value: 'Playtime (Seconds)', position: 'insideBottom', offset: 0 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [value, 'Count']}
              labelFormatter={(label) => `Mean Playtime: ${label}s`}
            />
            <Bar dataKey="count" fill="#764ba2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  

const LoyaltyPieChart = ({ data, title }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, value }) => `${category}: ${value}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const ExplorationChart = ({ data, title, dataKey }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [value, 'Count']}
          labelFormatter={(label) => `Month: ${new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#f093fb" 
          strokeWidth={2} 
          dot={{ fill: '#f093fb', strokeWidth: 2, r: 4 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function Section3Charts({ data }) {
    return (
      <div>
        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <MetricCard 
            title="Skip Rate" 
            value={`${data.skipRate}%`} 
            subtitle="Percentage of tracks skipped"
            color="#f5576c"
          />
          <MetricCard 
            title="Loyalty Metric" 
            value={`${data.loyaltyMetric}%`} 
            subtitle="Repeated track playtime"
            color="#43e97b"
          />
          <MetricCard 
            title="New Tracks" 
            value={data.newTracksCount} 
            subtitle="Total new tracks discovered"
            color="#4facfe"
          />
          <MetricCard 
            title="New Artists" 
            value={data.newArtistsCount} 
            subtitle="Total new artists discovered"
            color="#00f2fe"
          />
        </div>
  
        {/* Streams and Histogram Side by Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <TopStreaksChart data={data.topStreaks} />
          <TrackPlaytimeHistogram data={data.trackPlaytimeHistogram} />
        </div>
        
        {/* Loyalty Pie Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <LoyaltyPieChart data={data.loyaltyPieCharts.topTracks} title="Top 10 Tracks vs Rest" />
          <LoyaltyPieChart data={data.loyaltyPieCharts.topArtists} title="Top 10 Artists vs Rest" />
        </div>
  
        {/* Exploration Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
          <ExplorationChart 
            data={data.explorationCharts.newArtistsPerMonth} 
            title="New Artists Discovered Per Month" 
            dataKey="count"
          />
          <ExplorationChart 
            data={data.explorationCharts.newTracksPerMonth} 
            title="New Tracks Discovered Per Month" 
            dataKey="count"
          />
        </div>
      </div>
    );
  }
  