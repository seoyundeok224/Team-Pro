import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MainMap from './components/MainMap/MainMap';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import Sidebar from './components/Sidebar/Sidebar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
