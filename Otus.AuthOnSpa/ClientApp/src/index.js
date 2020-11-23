import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {authService} from "./AuthService";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

export let currentUser = null;
authService
  .initAuth()
  .then(
    r => {
       currentUser = r;

      ReactDOM.render(
        <BrowserRouter basename={baseUrl}>
          <App />
        </BrowserRouter>,
        rootElement);       
       
    },
    (error) => {
      setIsLoaded(true);
      setError(error);
    }
  )




registerServiceWorker();

