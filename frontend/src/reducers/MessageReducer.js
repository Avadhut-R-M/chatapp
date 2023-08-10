const ADD_INITIAL_MESSAGE_DATA = "ADD_INITIAL_MESSAGE_DATA";
const ADD_MESSAGE_DATA = "ADD_MESSAGE_DATA";
const ADD_NEW_MESSAGE = "ADD_NEW_MESSAGE";

const initialData = {
    list: [
        { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        // { id: 2, content: "new 2", sender: "you" },
        // { id: 1, content: "new", sender: "me" },
        { id: 2, content: "new 2  ", sender: "you" },
    ],
    create_new_group: false,
};

const MessageReducer = (state = initialData, action) => {
    let new_list = state.list;
    switch (action.type) {
        case ADD_INITIAL_MESSAGE_DATA:
            return { ...state, list: action.payload };

        case ADD_MESSAGE_DATA:
            action.payload.reverse().concat(new_list);
            return { ...state, list: action.payload };

        case ADD_NEW_MESSAGE:
            new_list.push(action.payload);
            return { ...state, list: new_list };

        default:
            return state;
    }
};

export {
    MessageReducer,
    ADD_INITIAL_MESSAGE_DATA,
    ADD_MESSAGE_DATA,
    ADD_NEW_MESSAGE,
};
