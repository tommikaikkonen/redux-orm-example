export function viewReducer(state = 'Books', action) {
    switch (action.type) {
    case 'SELECT_VIEW':
        return action.payload;
    default:
        return state;
    }
}
