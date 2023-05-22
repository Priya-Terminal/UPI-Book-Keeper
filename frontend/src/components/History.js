import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    amtSpent: 2400,
    amtReceived: 1500
  },
  {
    name: 'Feb',
    amtSpent: 1398,
    amtReceived: 2000
  },
  {
    name: 'Mar',
    amtSpent: 9800,
    amtReceived: 2290
  },
  {
    name: 'Apr',
    amtSpent: 3908,
    amtReceived: 2000
  },
  {
    name: 'May',
    amtSpent: 4800,
    amtReceived: 2181
  },
  {
    name: 'Jun',
    amtSpent: 3800,
    amtReceived: 2500
  },
  {
    name: 'Jul',
    amtSpent: 4300,
    amtReceived: 2100
  },
  {
    name: 'Aug',
    amtSpent: 2400,
    amtReceived: 1500
  },
  {
    name: 'Sep',
    amtSpent: 1398,
    amtReceived: 2000
  },
  {
    name: 'Oct',
    amtSpent: 9800,
    amtReceived: 2290
  },
  {
    name: 'Nov',
    amtSpent: 3908,
    amtReceived: 2000
  },
  {
    name: 'Dec',
    amtSpent: 4800,
    amtReceived: 2181
  },
];

function StackedBarChart() {
  return (
    <div className="chart-container">
      <h2>Monthly Transactions</h2>
      <div className="chart-and-table">
        <div className="chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              {/* Chart components */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amtSpent" stackId="a" fill="#ff69b4" />
              <Bar dataKey="amtReceived" stackId="a" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount Spent</th>
                <th>Amount Received</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ name, amtSpent, amtReceived }) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{amtSpent}</td>
                  <td>{amtReceived}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StackedBarChart;





