import {CRUDModel} from '../utils';

export class Publisher extends CRUDModel {
    static validate(props) {
        if (props.name && props.name.length > 0) {
            return true;
        }
        return false;
    }

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
