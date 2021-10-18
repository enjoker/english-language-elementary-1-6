import { USER_DETAIL, USER_MODALRENAME } from '../actions/user';

const initialState = {
    userName: null,
    loadingUser: true,
    showRenameModal: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_DETAIL:
            return {
                ...state,
                userName: action.userName,
                loadingUser: false
            }
        case USER_MODALRENAME:
            return {
                ...state,
                showRenameModal: action.showModal
            }
        default:
            return state;
    }
}
export default userReducer;