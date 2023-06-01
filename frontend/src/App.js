import "./App.css"
import React from 'react';
import { BrowserRouter, Link, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import HistoryPage from './pages/HistoryPage';
// import StackedBarChart from './components/History';
// import ParentComponent from './ParentComponent'; 
import TextExtraction from './pages/TextExtraction';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <div className="header-container">
          <div className="logo-container">
            <h1>
              <Link to="/" style={{ textDecoration: "none" }}>
                UPI Book Keeper
              </Link>
            </h1>
            </div>
            <nav className="nav-bar">
            <ul className="header-links">
              <h1>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  Sign Up
                </Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Log In
                </Link>
              </h1>
            </ul>
            </nav>
          </div>
        </header>
        <div className="main-container">
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/historypage" element={<HistoryPage />} />
            <Route path="/" element={<LocationAwareComponent />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </div>
    </BrowserRouter>
  );
}

function LocationAwareComponent() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <TextExtraction />;
  }

  return <h2>Hello! Welcome to the application.</h2>;
}

export default App;





