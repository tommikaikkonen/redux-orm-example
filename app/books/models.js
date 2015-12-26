import {fk, many} from 'redux-orm';
import {CRUDModel} from '../utils';

export class Book extends CRUDModel {
    // This classmethod holds no special meaning
    // in redux-orm, we just use it in formComponents.
    static validate(publisher) {
        const hasName = publisher.name && publisher.name.length > 0;
        const hasPublisher = publisher.publisher !== null;
        const hasGenres = publisher.genres.length > 0;
        const hasAuthors = publisher.authors.length > 0;

        if (hasName && hasPublisher && hasGenres && hasAuthors) {
            return true;
        }
        return false;
    }

    toString() {
        return `Book: ${this.name}`;
    }
}
Book.modelName = 'Book';

Book.fields = {
    authors: many('Author'),
    publisher: fk('Publisher'),
    genres: many('Genre'),
};
