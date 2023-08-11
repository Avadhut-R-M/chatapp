import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { GroupReducer } from '../reducers/GroupReducer';
import { MessageReducer } from '../reducers/MessageReducer';

const rootReducer = {
    'group': GroupReducer,
    'message': MessageReducer
}


const actionHandler = store => next => action => {
  if(!action.hasOwnProperty("url")){
    return next(action)
  }
  if (action.type == 'API'){
    fetch(action.url, action.options)
      .then(resp =>{
        if(resp.ok){
          resp.json().then(data => {
            if ('successAction' in action)
              store.dispatch(action.successAction(data, action.extraParams))
          })
        }

        else{
          resp.json().then(data => {
            if ('failureAction' in action)
              store.dispatch(action.failureAction(data, action.extraParams))
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, actionHandler],
    preloadedState,
    // enhancers: [monitorReducerEnhancer]
  })
  return store
}