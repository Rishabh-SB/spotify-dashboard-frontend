'use client';
eslint-disable react/display-name

import { 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f'];

const PlatformPercentagesChart = ({ data }) => {
    // Custom label renderer showing percentage outside pie slices
    const renderCustomizedLabel = ({
      cx, cy, midAngle, innerRadius, outerRadius, percent,
    }) => {
      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 20;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
      return (
        <text
          x={x}
          y={y}
          fill="#333"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ fontSize: 12, fontWeight: 'bold' }}
        >
          {(percent * 100).toFixed(1)}%
        </text>
      );
    };
  
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Platform Percentages (Ring Chart)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={150}
              paddingAngle={5}
              dataKey="percentage"
              nameKey="platform"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, 'Usage']}
              contentStyle={{ backgroundColor: '#fff', color: '#333', borderRadius: '8px', padding: '8px', border: '1px solid #ccc' }}
              itemStyle={{ color: '#333', fontWeight: 'bold' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  
const PlatformUsageOverTimeChart = ({ data }) => {
    console.log(data);
  // Get all unique platforms from the data
  const platforms = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'date') : [];
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.3rem' }}>Platform Usage Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value} hours`, name]}
            labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          />
          <Legend />
          {platforms.map((platform, index) => (
            <Area
              key={platform}
              type="monotone"
              dataKey={platform}
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Section4Charts({ data }) {
  return (
    <div>
      <PlatformPercentagesChart data={data.platformPercentages} />
      <PlatformUsageOverTimeChart data={data.platformUsageOverTime} />
    </div>
  );
}
