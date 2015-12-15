import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {viewReducer} from './reducers';
import App from './components';
import {schema} from './models';
import logger from 'redux-diff-logger';

const rootReducer = combineReducers({
    orm: schema.reducer(),
    view: viewReducer,
});

const createStoreWithMiddleWare = applyMiddleware(logger)(createStore);

function bootstrapState() {
    const initialState = schema.getDefaultState();
    const {
        Book,
        Author,
        Publisher,
        Genre,
    } = schema.withMutations(initialState);

    const business = Genre.create({name: 'Business'});
    const philosophy = Genre.create({name: 'Philosophy'});
    const fiction = Genre.create({name: 'Fiction'});
    const nonFiction = Genre.create({name: 'Non-Fiction'});

    const publisher1 = Publisher.create({name: 'Awesome Publishing'});
    const publisher2 = Publisher.create({name: 'Good Publishing'});
    const publisher3 = Publisher.create({name: 'Mediocre Publishing'});

    const author1 = Author.create({name: 'John Doe'});
    const author2 = Author.create({name: 'Jane Doe'});
    const author3 = Author.create({name: 'Mary Doe'});

    const book1 = Book.create({
        name: 'Great Business Book!',
        publisher: publisher1,
    });

    book1.authors.add(author1);
    book1.genres.add(business, nonFiction);

    const book2 = Book.create({
        name: 'Pretty Good Philosophy Book',
        publisher: publisher2,
    });
    book2.authors.add(author2);
    book2.genres.add(philosophy, nonFiction);

    const book3 = Book.create({
        name: 'Not That Good of a Book',
        publisher: publisher3,
    });
    book3.authors.add(author3);
    book3.genres.add(fiction);

    return initialState;
}

const initialState = bootstrapState();

const store = createStoreWithMiddleWare(rootReducer, {
    orm: initialState,
    view: 'Books',
});

function main() {
    const app = document.getElementById('app');
    ReactDOM.render((
        <Provider store={store}>
            <App />
        </Provider>), app);
}

main();
