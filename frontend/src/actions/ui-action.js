import { CHANGE_PAGE, RESET_PAGE } from "../reducers/UiReducer";

export const change_page = (page) => {
  return (dispatch, getstate) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: page,
    });
  };
};

export const reset_page = () => {
  return (dispatch, getstate) => {
    dispatch({
      type: RESET_PAGE,
    });
  };
};
