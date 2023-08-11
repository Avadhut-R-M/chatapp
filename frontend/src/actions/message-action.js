import {
    ADD_INITIAL_MESSAGE_DATA,
    ADD_MESSAGE_DATA,
    ADD_NEW_MESSAGE,
} from "../reducers/MessageReducer";


export const get_messages = (group_id) => {
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

        let url = `http://127.0.0.1:8000/api/message/?group_id=${group_id}`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessGetMessage
        })
    }
}

const SuccessGetMessage = (data) => {
    return (dispatch, getstate) =>{
        dispatch({
            type: ADD_INITIAL_MESSAGE_DATA,
            payload: data || []
        })
    }
}

export const send_messages = (data) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        headers.append('Authorization', `Token ${state?.auth?.token}`)

        let options = {
            method : 'POST',
            headers,
            body: JSON.stringify(data)
        }

        let url = `http://127.0.0.1:8000/api/message/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessSendMessage
        })
    }
}

const SuccessSendMessage = (data) => {
    return (dispatch, getstate) =>{
        dispatch({
            type: ADD_NEW_MESSAGE,
            payload: data || []
        })
    }
}