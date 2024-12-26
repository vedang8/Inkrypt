import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import { ConfigProvider } from "antd";
import { store } from './redux/Store/Store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <ConfigProvider>
          <App />
      </ConfigProvider>
    </Provider>
);

