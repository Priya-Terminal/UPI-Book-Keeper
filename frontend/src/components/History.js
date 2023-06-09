import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// this function takes all the data and aggregates it by day/month/year
// and returns an array of objects with the aggregated data
// type can be day, month or year
// output format: [{period: "01", amount: 100}, ...] if day
// output format: [{period: "Jan", amount: 100}, ...] if month
// output format: [{period: "2021", amount: 100}, ...] if year
const aggregateData = (data, type) => {
  const aggregatedData = [];
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();

  // if type is day, aggregate by day
  if (type === "day") {
    for (let i = 1; i <= currentDay; i++) {
      let received = 0;
      let failed = 0;
      data.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getDate() === i) {
          if (["success", "completed"].includes(transaction.status.toLowerCase())) {
            received += transaction.amount;
          } else {
            failed += transaction.amount;
          }
        }
      });
      aggregatedData.push({ period: i, received, failed });
    }
  } else if (type === "month") {
    for (let i = 0; i <= currentMonth; i++) {
      let received = 0;
      let failed = 0;
      data.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === i) {
          if (["success", "completed"].includes(transaction.status.toLowerCase())) {
            received += transaction.amount;
          } else {
            failed += transaction.amount;
          }
        }
      });
      aggregatedData.push({ period: i + 1, received, failed });
    }
  } else if (type === "year") {
    for (let i = 2021; i <= currentYear; i++) {
      let received = 0;
      let failed = 0;
      data.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getFullYear() === i) {
          if (["success", "completed"].includes(transaction.status.toLowerCase())) {
            received += transaction.amount;
          } else {
            failed += transaction.amount;
          }
        }
      });
      aggregatedData.push({ period: i, received, failed });
    }
  }
  console.log(aggregatedData);
  return aggregatedData;
};

function StackedBarChart() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("day");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/transaction");
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <h2>Monthly Transactions</h2>
      <div className="chart-and-table">
        <div className="chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={aggregateData(data, type)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* Chart components */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis  />
              <Tooltip />
              <Legend />
              <Bar dataKey="received" fill="#00b894" />
              <Bar dataKey="failed" fill="#d63031" />
            </BarChart>
          </ResponsiveContainer>
          {/* drop down to change the type of data displayed */}
          <div className="dropdown">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <br />
          <a href="/transaction">Add Transaction</a>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Date</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, date, provider, status, amount, image }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{new Date(date).toDateString()}</td>
                  <td>{provider}</td>
                  <td>{status}</td>
                  <td>{amount}</td>
                  <td>
                    <img src={image} height={90} width={35}></img>
                  </td>
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
