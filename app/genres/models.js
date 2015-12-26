import {CRUDModel} from '../utils';

export class Genre extends CRUDModel {
    static validate(props) {
        if (props.name && props.name.length > 0) {
            return true;
        }
        return false;
    }
}
Genre.modelName = 'Genre';
