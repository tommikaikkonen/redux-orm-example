import schema from '../schema';

export const authorSelector = schema.createSelector(session => {
    console.log('Running authorSelector');
    return session.Author.map(author => {
        const obj = author.toPlain();
        return Object.assign(obj, {
            genres: author.writesGenres(),
        });
    });
});

export const authorChoices = schema.createSelector(session => {
    return session.Author.map(author => ({id: author.getId(), name: author.name}));
});
