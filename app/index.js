import React from 'react';
import ReactDOM from 'react-dom';
import {store, App} from './app';
import {Provider} from 'react-redux';

function main() {
    const app = document.getElementById('app');
    ReactDOM.render((
        <Provider store={store}>
            <App />
        </Provider>), app);
}

main();
