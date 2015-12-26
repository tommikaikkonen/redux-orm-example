import schema from '../schema';

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

export const bookChoices = schema.createSelector(session => {
    return session.Book.map(book => ({id: book.getId(), name: book.toString()}));
});
