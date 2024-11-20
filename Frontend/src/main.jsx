import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import rootReducer from "./Reducer/index.jsx"
import { configureStore } from "@reduxjs/toolkit"


const store = configureStore({
  reducer: rootReducer,
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>,
)
