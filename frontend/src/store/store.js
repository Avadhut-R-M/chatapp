import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { GroupReducer } from "../reducers/GroupReducer";
import { MessageReducer } from "../reducers/MessageReducer";
import { UserReducer } from "../reducers/UserReducer";
import { UiReducer } from "../reducers/UiReducer";
import { set_log_out } from "../actions/user-action";
import { auth_api } from "../actions/api-endpoint";

const rootReducer = {
  group: GroupReducer,
  message: MessageReducer,
  user: UserReducer,
  ui: UiReducer,
};

const actionHandler = (store) => (next) => (action) => {
  let access_token = localStorage.getItem("access_token");
  let refresh_token = localStorage.getItem("refresh_token");
  if (!action.hasOwnProperty("url")) {
    return next(action);
  }
  if (action.type == "API") {
    if (!access_token) {
      store.dispatch(set_log_out());
    }
    if (action?.["options"]?.["headers"] && access_token) {
      let headers = action.options.headers;
      headers.set("Authorization", `Bearer ${access_token}`);
      action.options.headers = headers;
    }

    fetch(action.url, action.options)
      .then((resp) => {
        if (resp.ok) {
          if ([204, 205].includes(resp.status)) {
            if ("successAction" in action)
              store.dispatch(action.successAction(action.extraParams));
          } else
            resp?.json()?.then((data) => {
              if ("successAction" in action)
                store.dispatch(action.successAction(data, action.extraParams));
            });
        } else {
          if (resp.status == "401" && refresh_token) {
            let headers = new Headers({
              "Content-Type": "application/json",
            });
            let refresh_data = { refresh: refresh_token };
            let refresh_options = {
              method: "POST",
              headers,
              body: JSON.stringify(refresh_data),
            };
            fetch(
              `${auth_api}/refresh_token`,
              refresh_options
            ).then((resp) => {
              if (resp.ok) {
                resp?.json()?.then((data) => {
                  if (data.access)
                    localStorage.setItem("access_token", data.access);
                  if (data.refresh)
                    localStorage.setItem("refresh_token", data.refresh);
                  actionHandler(store)(next)(action);
                });
              } else {
                localStorage.clear();
                store.dispatch(set_log_out());
              }
            });
          }
          resp.json().then((data) => {
            if ("failureAction" in action)
              store.dispatch(action.failureAction(data, action.extraParams));
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, actionHandler],
    preloadedState,
    // enhancers: [monitorReducerEnhancer]
  });
  return store;
}
