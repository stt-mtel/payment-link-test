import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Payment from "./Payment";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="payment" element={<Payment />} />
      </Routes>
    </div>
  );
};

export default App;