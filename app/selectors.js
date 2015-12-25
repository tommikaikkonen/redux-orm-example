import {schema} from './models';

export const bookChoices = schema.createSelector(session => {
    return session.Book.map(book => ({id: book.getId(), name: book.toString()}));
});

export const authorChoices = schema.createSelector(session => {
    return session.Author.map(author => ({id: author.getId(), name: author.name}));
});

export const publisherChoices = schema.createSelector(session => {
    return session.Publisher.map(publisher => ({id: publisher.getId(), name: publisher.name}));
});

export const genreChoices = schema.createSelector(session => {
    return session.Genre.map(genre => ({id: genre.getId(), name: genre.name}));
});

export const bookSelector = schema.createSelector(session => {
    console.log('Running bookSelector');
    return session.Book.map(book => {
        const obj = book.toPlain();
        return Object.assign(obj, {
            authors: book.authors.map(author => ({id: author.id, name: author.name})),
            genres: book.genres.map(genre => ({id: genre.id, name: genre.name})),
            publisher: book.publisher.toPlain(),
        });
    });
});

export const authorSelector = schema.createSelector(session => {
    console.log('Running authorSelector');
    return session.Author.map(author => {
        const obj = author.toPlain();
        return Object.assign(obj, {
            genres: author.writesGenres(),
        });
    });
});

export const publisherSelector = schema.createSelector(session => {
    console.log('Running publisherSelector');
    return session.Publisher.map(publisher => {
        const obj = publisher.toPlain();
        return Object.assign(obj, {
            books: publisher.bookSet.plain.map(book => ({id: book.id, name: book.name})),
            authors: publisher.authors.plain.map(author => ({id: author.id, name: author.name})),
        });
    });
});

export const genreSelector = schema.createSelector(session => {
    console.log('Running genreSelector');
    return session.Genre.map(genre => {
        const obj = genre.toPlain();
        return Object.assign(obj, {
            books: genre.bookSet.plain.map(book => ({id: book.id, name: book.name})),
        });
    });
});
