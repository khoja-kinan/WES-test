import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import LoginPage from "./pages/Login";
import UserTable from "./pages/home";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user-table" element={<UserTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
