import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./global.css";

import Routes from "./components/Routes";
import Header from "./components/Header";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
