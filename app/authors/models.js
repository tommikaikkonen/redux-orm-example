import {CRUDModel} from '../utils';

export class Author extends CRUDModel {
    static validate(props) {
        if (props.name && props.name.length > 0) {
            return true;
        }
        return false;
    }

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
