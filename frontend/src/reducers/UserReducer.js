const ADD_INITIAL_USER_DATA = "ADD_INITIAL_USER_DATA";
const ADD_NEW_USER = "ADD_NEW_USER";
const UPDATE_LIST = "UPDATE_LIST";
const RESET_NEW_USER_MODAL = "RESET_NEW_USER_MODAL";
const OPEN_NEW_USER_MODAL = "OPEN_NEW_USER_MODAL";
const ADD_CURRENT_USER = "ADD_CURRENT_USER";
const RESET_EDIT_USER_MODAL = "RESET_EDIT_USER_MODAL";
const OPEN_EDIT_USER_MODAL = "OPEN_EDIT_USER_MODAL";
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const initialData = {
  list: [],
  new_user_modal_open: false,
  current_user: {},
  edit_user_modal_open: false,
  edit_user_id: null,
  is_logged_in: false,
};

const UserReducer = (state = initialData, action) => {
  let new_list = state.list;
  switch (action.type) {
    case ADD_INITIAL_USER_DATA:
      return { ...state, list: [...action.payload] };

    case ADD_NEW_USER:
      new_list.push(action.payload);
      return { ...state, list: [...new_list] };

    case UPDATE_LIST:
      return { ...state, list: action.payload };

    case RESET_NEW_USER_MODAL:
      return { ...state, new_user_modal_open: false };

    case OPEN_NEW_USER_MODAL:
      return { ...state, new_user_modal_open: true };

    case RESET_EDIT_USER_MODAL:
      return { ...state, edit_user_modal_open: false, edit_user_id: null };

    case OPEN_EDIT_USER_MODAL:
      return {
        ...state,
        edit_user_modal_open: true,
        edit_user_id: action.payload,
      };

    case ADD_CURRENT_USER:
      return { ...state, current_user: action.payload };

    case LOGIN:
      return { ...state, is_logged_in: true };

    case LOGOUT:
      return { ...state, is_logged_in: false };

    default:
      return state;
  }
};

export {
  UserReducer,
  ADD_INITIAL_USER_DATA,
  ADD_NEW_USER,
  UPDATE_LIST,
  RESET_NEW_USER_MODAL,
  OPEN_NEW_USER_MODAL,
  ADD_CURRENT_USER,
  RESET_EDIT_USER_MODAL,
  OPEN_EDIT_USER_MODAL,
  LOGIN,
  LOGOUT,
};
