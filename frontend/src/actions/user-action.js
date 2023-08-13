import { toast } from "react-toastify";
import {
  ADD_INITIAL_USER_DATA,
  ADD_NEW_USER,
  RESET_NEW_USER_MODAL,
  OPEN_NEW_USER_MODAL,
  ADD_CURRENT_USER,
  RESET_EDIT_USER_MODAL,
  OPEN_EDIT_USER_MODAL,
  LOGOUT,
  LOGIN,
} from "../reducers/UserReducer";
import { user_api, auth_api } from "./api-endpoint";

export const create_user = (data) => {
  return (dispatch, getState) => {
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    let url = `${user_api}/`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessUserCreate,
      failureAction: FailUserCreate,
    });
  };
};

const SuccessUserCreate = (data) => {
  return (dispatch, getstate) => {
    dispatch({
      type: ADD_NEW_USER,
      payload: data || [],
    });

    dispatch(close_new_user_modal());
    toast("New User Created");
  };
};

const FailUserCreate = (data) => {
  return (dispatch, getstate) => {
    toast("Check all fields before submissoin");
  };
};

export const get_users = (name = "") => {
  return (dispatch, getState) => {
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    let options = {
      method: "GET",
      headers,
    };

    let url = `${user_api}/?name=${name}`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessGetUsers,
    });
  };
};

const SuccessGetUsers = (data) => {
  return (dispatch, getstate) => {
    dispatch({
      type: ADD_INITIAL_USER_DATA,
      payload: data || [],
    });
  };
};

export const close_new_user_modal = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: RESET_NEW_USER_MODAL,
    });
  };
};

export const open_new_user_modal = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: OPEN_NEW_USER_MODAL,
    });
  };
};

export const delete_users = (id = "") => {
  return (dispatch, getState) => {
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    let options = {
      method: "DELETE",
      headers,
    };

    let url = `${user_api}/${id}/`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessDeleteUsers,
      extraParams: { id: id },
    });
  };
};

const SuccessDeleteUsers = (extraParams) => {
  return (dispatch, getstate) => {
    let state = getstate();
    let user = state.user.list;
    user = user.filter((u) => u.id != extraParams.id);
    dispatch({
      type: ADD_INITIAL_USER_DATA,
      payload: user || [],
    });
    toast("Deleted the user");
  };
};

export const close_edit_user_modal = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: RESET_EDIT_USER_MODAL,
    });
  };
};

export const open_edit_user_modal = (id) => {
  return (dispatch, getstate) => {
    dispatch({
      type: OPEN_EDIT_USER_MODAL,
      payload: id,
    });
  };
};

export const edit_user = (id, data) => {
  return (dispatch, getState) => {
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    let options = {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    };

    let url = `${user_api}/${id}/`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessUserEdit,
      failureAction: FailUserCreate,
    });
  };
};

const SuccessUserEdit = (data) => {
  return (dispatch, getstate) => {
    let state = getstate();
    let users = state.user.list;
    users = users.map((user) => {
      if (user.id == data.id) {
        return data;
      }
      return user;
    });
    dispatch({
      type: ADD_INITIAL_USER_DATA,
      payload: users || [],
    });
    dispatch(close_edit_user_modal());
  };
};

export const set_log_in = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: LOGIN,
    });
  };
};

export const set_log_out = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: LOGOUT,
    });
  };
};

export const login = (username, password) => {
  return (dispatch, getState) => {
    let state = getState();
    let headers = new Headers({
      "Content-Type": "application/json",
    });
    let data = { username: username, password: password };

    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    let url = `${auth_api}/token`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessUserLogin,
    });
  };
};

const SuccessUserLogin = (data) => {
  return (dispatch, getstate) => {
    localStorage.clear();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    dispatch(set_log_in());
  };
};

export const logout = () => {
  return (dispatch, getstate) => {
    let refresh_token = localStorage.getItem("refresh_token");
    let data = { refresh_token: refresh_token };
    let headers = new Headers({
      "Content-Type": "application/json",
    });
    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    let url = `${auth_api}/logout/`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: successLogOut,
    });
  };
};

const successLogOut = (data) => {
  return (dispatch, getstate) => {
    localStorage.clear();
    dispatch(set_log_out());
  };
};

export const get_current_user = () => {
  return (dispatch, getState) => {
    let state = getState();
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    let options = {
      method: "GET",
      headers,
    };

    let url = `${user_api}/current_user`;

    dispatch({
      type: "API",
      options: options,
      url: url,
      successAction: SuccessGetCurrentUser,
    });
  };
};

const SuccessGetCurrentUser = (data) => {
  return (dispatch, getstate) => {
    dispatch({
      type: ADD_CURRENT_USER,
      payload: data || {},
    });
  };
};
