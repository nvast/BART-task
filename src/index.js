import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import Gallery from './components/gallery/Gallery';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route index path="/" element={<App />} />
        <Route path="/gallery/:path" element={<Gallery />} />
      </Routes>
  </BrowserRouter>
);

