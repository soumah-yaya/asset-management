import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/index';
import './assets/css/global.css'
import './assets/css/color.css'
import 'antd-button-color/dist/css/style.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

