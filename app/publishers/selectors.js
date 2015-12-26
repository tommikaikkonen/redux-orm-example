import schema from '../schema';

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

export const publisherChoices = schema.createSelector(session => {
    return session.Publisher.map(publisher => ({id: publisher.getId(), name: publisher.name}));
});