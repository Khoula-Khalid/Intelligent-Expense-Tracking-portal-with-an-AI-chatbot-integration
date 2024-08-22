import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PieChartDashboard({ totalIncome, totalBudget, totalSpend, budgetList }) {
  // Calculate total budget and total spend from budgetList
  let totalBudget_ = 0;
  let totalSpend_ = 0;

  budgetList.forEach((element) => {
    totalBudget_ += Number(element.amount);
    totalSpend_ += element.totalSpend || 0; // Ensure totalSpend is defaulted to 0 if undefined
  });

  const data = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Budget', value: totalBudget_ },
    { name: 'Total Spend', value: totalSpend_ },
  ];

  const COLORS = ['#ff7300', '#82ca9d', '#8884d8'];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position the label further out
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12} // Adjust font size for better readability
      >
        {`${data[index].name}: $${data[index].value.toLocaleString()}`}
      </text>
    );
  };

  return (
    <div className='mt-1'>
      <h2 className='font-bold text-lg mb-4'>Overview</h2>
      <div className='border rounded-lg p-5' style={{ width: '100%', height: '500' }}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={true} // Add lines connecting labels to slices
              label={renderCustomizedLabel} // Use custom label renderer
              paddingAngle={2} // Adjust spacing between segments to reduce white space
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend verticalAlign="top" height={36} /> {/* Adjust legend position */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartDashboard;
