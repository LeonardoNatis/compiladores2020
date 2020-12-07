import React from "react";
import Navbar from './React components/Navbar/Navbar';
import "./App.css";

import Routes from './routes';

function App() {
  return (
    <div className="container">
      <Navbar />
      <br />
      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
