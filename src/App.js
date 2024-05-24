import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import AdditionalPage from './components/AdditionalPage';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/additional" element={<AdditionalPage />} />
      </Routes>
    </Router>
  );
};

export default App;
