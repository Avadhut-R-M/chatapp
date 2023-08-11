import {
    ADD_NEW_GROUP,
    ADD_INITIAL_GROUPS_DATA,
    ADD_GROUPS_DATA,
    NEW_GROUP_CREATION,
    CHANGE_SELECTED_GROUP_ID
} from "../reducers/GroupReducer";


export const get_groups = () => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        headers.append('Authorization', `Token ${state?.auth?.token}`)

        let options = {
            method : 'GET',
            headers
        }

        let url = 'http://127.0.0.1:8000/api/group/'

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessGetUser
        })
    }
}

const SuccessGetUser = (data) => {
    return (dispatch, getstate) =>{
        dispatch({
            type: ADD_INITIAL_GROUPS_DATA,
            payload: data || []
        })
    }
}

export const set_selected_group = (id=null, name='') => {
    return (dispatch, getstate) =>{
        dispatch({
            type: CHANGE_SELECTED_GROUP_ID,
            payload: {'id':id, 'name':name}
        })
    }
}
