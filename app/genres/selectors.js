import schema from '../schema';

export const genreSelector = schema.createSelector(session => {
    console.log('Running genreSelector');
    return session.Genre.map(genre => {
        const obj = genre.toPlain();
        return Object.assign(obj, {
            books: genre.bookSet.plain.map(book => ({id: book.id, name: book.name})),
        });
    });
});

export const genreChoices = schema.createSelector(session => {
    return session.Genre.map(genre => ({id: genre.getId(), name: genre.name}));
});
