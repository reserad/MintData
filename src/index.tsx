import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';

import "./styles/app.scss";

import { store } from "./store/store";
import Router from './components/router';

ReactDOM.render(
    <Provider store={store}>
        <Router/>
    </Provider>,
    document.getElementById('root')
);