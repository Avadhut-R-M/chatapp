const CHANGE_PAGE = "CHANGE_PAGE"
const RESET_PAGE = "RESET_PAGE"

const initialData = {
    page: 'messages'
};

const UiReducer = (state = initialData, action) => {
    switch (action.type) {
        case CHANGE_PAGE:
            return { ...state, page: action.payload };

        case RESET_PAGE:
            return { ...state, page: 'messages' };

        default:
            return state;
    }
}

export{
    UiReducer,
    CHANGE_PAGE,
    RESET_PAGE
}