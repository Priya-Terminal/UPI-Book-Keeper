import './App.css';
import React from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import HistoryPage from './pages/HistoryPage';
import StackedBarChart from './components/History';
import ParentComponent from './ParentComponent'; 
import TextExtraction from './pages/TextExtraction';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <div className="header-container">
            <h1>
              <Link to="/" style={{ textDecoration: "none" }}>
                UPI Book Keeper
              </Link>
            </h1>
          </div>
          <div>
            <nav className="nav-bar">
              <ul>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link to="/login">Log In</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/historypage" element={<HistoryPage />} />
        </Routes>
        <TextExtraction />
     
      </div>
    </BrowserRouter>
  );
}

export default App;




