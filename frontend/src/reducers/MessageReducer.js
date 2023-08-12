const ADD_INITIAL_MESSAGE_DATA = "ADD_INITIAL_MESSAGE_DATA";
const ADD_MESSAGE_DATA = "ADD_MESSAGE_DATA";
const ADD_NEW_MESSAGE = "ADD_NEW_MESSAGE";
const ADD_LIKE = "ADD_LIKE";
const RESET_SCROLL = "RESET_SCROLL";

const initialData = {
  list: [],
  scroll_to_bottom: false,
};

const MessageReducer = (state = initialData, action) => {
  let new_list = state.list;
  switch (action.type) {
    case ADD_INITIAL_MESSAGE_DATA:
      return {
        ...state,
        list: action.payload.reverse(),
        scroll_to_bottom: true,
      };

    case ADD_MESSAGE_DATA:
      action.payload.reverse().concat(new_list);
      return { ...state, list: [...action.payload] };

    case ADD_NEW_MESSAGE:
      new_list.push(action.payload);
      return { ...state, list: [...new_list], scroll_to_bottom: true };

    case ADD_LIKE:
      return { ...state, list: action.payload };

    case RESET_SCROLL:
      return { ...state, scroll_to_bottom: false };

    default:
      return state;
  }
};

export {
  MessageReducer,
  ADD_INITIAL_MESSAGE_DATA,
  ADD_MESSAGE_DATA,
  ADD_NEW_MESSAGE,
  ADD_LIKE,
  RESET_SCROLL,
};
