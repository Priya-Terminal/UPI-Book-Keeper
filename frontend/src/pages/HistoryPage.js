import React, { useEffect, useState } from 'react';
import  StackedBarChart  from '../components/History';

const HistoryPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const historyData = [
      { date: 'January', spent: 100, received: 200 },
      { date: 'February', spent: 150, received: 180 },
      { date: 'March', spent: 80, received: 120 },
      { date: 'April', spent: 200, received: 250 },
      { date: 'May', spent: 120, received: 160 },
      { date: 'June', spent: 180, received: 210 },
    ];

    console.log('historyData:', historyData);

    setData(historyData);
  }, []);

console.log('data:', data); 

  return (
    <div>
      <h1>Transaction History</h1>
      <StackedBarChart data={data} />
    </div>
  );
};

export default HistoryPage;


