import {Model} from 'redux-orm';

export class CRUDModel extends Model {
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
