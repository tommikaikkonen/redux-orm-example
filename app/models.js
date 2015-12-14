import {fk, many, Model} from 'redux-orm';

class CRUDModel extends Model {
    static reducer(state, action, ConcreteModel) {
        const modelName = ConcreteModel.modelName.toUpperCase();
        switch (action.type) {
        case 'CREATE_' + modelName:
            ConcreteModel.create(action.payload);
            break;
        case 'UPDATE_' + modelName:
            ConcreteModel.withId(action.payload.id).update(action.payload);
            break;
        case 'REMOVE_' + modelName:
            ConcreteModel.withId(action.payload).delete();
            break;
        default:
            return ConcreteModel.getNextState();
        }

        return ConcreteModel.getNextState();
    }
}

class Book extends CRUDModel {
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

class Author extends CRUDModel {
    writesGenres() {
        const authorBooks = this.bookSet;
        const allGenres = [];
        authorBooks.forEach(book => {
            allGenres.push(...book.genres.plain.map(genre => genre.name));
        });
        return allGenres;
    }
}
Author.modelName = 'Author';

class Publisher extends CRUDModel {
    get authors() {
        const AuthorModel = this.getClass().session.Author;
        const authorSet = {};

        this.bookSet.forEach(book => {
            book.authors.idArr.forEach(id => authorSet[id] = true);
        });

        const toInt = (intStr) => parseInt(intStr, 10);
        const authorIds = Object.keys(authorSet).map(toInt);

        return AuthorModel.getQuerySetFromIds(authorIds);
    }
}
Publisher.modelName = 'Publisher';

class Genre extends CRUDModel {}
Genre.modelName = 'Genre';

export {
  Book,
  Author,
  Publisher,
  Genre,
};

