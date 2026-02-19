import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type SalesData = {
  month: string;
  revenue: number;
};

const salesData: SalesData[] = [
  { month: 'JAN', revenue: 4000 },
  { month: 'FEB', revenue: 5200 },
  { month: 'MAR', revenue: 4800 },
  { month: 'APR', revenue: 6100 },
  { month: 'MAY', revenue: 7200 },
  { month: 'JUN', revenue: 8100 },
];

const SaleChart: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        width: '100%',
      }}
    >
      <h2
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1a2332',
          marginBottom: '20px',
        }}
      >
        Monthly Sales
      </h2>

      <div style={{ width: '100%', height: '320px' }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2E7D32"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SaleChart;