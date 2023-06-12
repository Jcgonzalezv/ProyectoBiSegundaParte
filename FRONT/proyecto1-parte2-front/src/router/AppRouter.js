import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BarNav } from "../components/navbar/barNav";
import { Home } from "../pages/index/Home";
import { Model } from "../pages/model/model";

export const AppRouter = () => {

  return (
      <Router>
        <BarNav/>
        <Routes>
          <Route path="/model" element={<Model />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
  );
};