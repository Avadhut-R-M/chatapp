const ADD_INITIAL_GROUPS_DATA = "ADD_INITIAL_GROUPS_DATA";
const ADD_GROUPS_DATA = "ADD_GROUPS_DATA";
const NEW_GROUP_CREATION = "NEW_GROUP_CREATION";
const ADD_NEW_GROUP = "ADD_NEW_GROUP";
const CHANGE_SELECTED_GROUP_ID = "CHANGE_SELECTED_GROUP_ID"

const initialData = {
    list: [],
    create_new_group: false,
    selected_group_id: null,
    selected_group_name: ''
};

const GroupReducer = (state = initialData, action) => {
    switch (action.type) {
        case ADD_INITIAL_GROUPS_DATA:
            return { ...state, list: action.payload };

        case ADD_GROUPS_DATA:
            return { ...state, list: [...state.list, ...action.payload] };

        case NEW_GROUP_CREATION:
            return { ...state, create_new_group: action.payload };

        case ADD_NEW_GROUP:
            let new_list = state.list
            new_list.unshift(action.payload)
            return { ...state, list: new_list };

        case CHANGE_SELECTED_GROUP_ID:
            return {...state, selected_group_id: action?.payload?.id, selected_group_name: action?.payload?.name}

        default:
            return state;
    }
};

export {
    GroupReducer,
    ADD_INITIAL_GROUPS_DATA,
    ADD_GROUPS_DATA,
    NEW_GROUP_CREATION,
    ADD_NEW_GROUP,
    CHANGE_SELECTED_GROUP_ID
};