import React, { useEffect, useState } from "react";
import StackedBarChart from "../components/History";

const HistoryPage = () => {
  return (
    <div>
      <h1>Transaction History</h1>
      <StackedBarChart />
    </div>
  );
};

export default HistoryPage;
