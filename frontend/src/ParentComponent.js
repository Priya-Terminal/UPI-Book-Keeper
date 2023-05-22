import React from 'react';
import StackedBarChart from './components/History';
const ParentComponent = () => {
    const data = [
      { date: '2023-01-01', spent: 100, received: 200 },
      { date: '2023-02-01', spent: 150, received: 100 },
    ];
  
    return (
      <div>
        <h1>Stacked Bar Chart Example</h1>
        <StackedBarChart data={data} />
      </div>
    );
  };
  export default ParentComponent;
