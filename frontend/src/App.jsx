import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home"
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import About from "./pages/About/About";
import HelloTemplate from "./pages/SimpleInvoiceTemplate/HelloTemplate";
import Pricing from "./pages/Pricing/Pricing";
import Dashboard from './pages/Dashboard/Dashboard';
import FrgPass from "./pages/frgpass/frgpass";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  console.log("Enjoy our service ..");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/helloTemplate" element={<HelloTemplate />} />
        <Route path="/About" element={<About />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/Dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/Frgpass" element={<FrgPass />} />
      </Routes>
    </Router>
  );
}

export default App;