import React from "react";
import Navbar from './React components/Navbar/Navbar';
import "./App.css";

import Routes from './routes';


function App() {
  return (
    <div className="container">
      <Navbar />
      <br />
      <h1>Welcome to our Compiler Project!</h1>
      <br />
      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
