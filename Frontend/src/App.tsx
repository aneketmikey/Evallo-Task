import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LogViewerPage } from "./pages/LogViewerPage";
import { LogIngestionPage } from "./pages/LogIngestionPage";
import "./App.css";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="app-nav">
          <Link to="/" className="nav-link">
            View Logs
          </Link>
          <Link to="/ingest" className="nav-link">
            Ingest Logs
          </Link>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LogViewerPage />} />
            <Route path="/ingest" element={<LogIngestionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
