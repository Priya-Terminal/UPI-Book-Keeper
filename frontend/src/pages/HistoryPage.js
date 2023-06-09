import React, { useEffect, useState } from "react";
import StackedBarChart from "../components/History";

const HistoryPage = ({ isUserLoggedIn }) => {
  return isUserLoggedIn ? (
    <div>
      <h1>Transaction History</h1>
      <StackedBarChart />
    </div>
  ) : (
    <div>
      <h1>Please login to view this page</h1>
    </div>
  );
};

export default HistoryPage;
