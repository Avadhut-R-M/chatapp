import {
    ADD_INITIAL_MESSAGE_DATA,
    ADD_MESSAGE_DATA,
    ADD_NEW_MESSAGE,
    ADD_LIKE,
    RESET_SCROLL
} from "../reducers/MessageReducer";
import { toast } from "react-toastify";


export const get_messages = (group_id) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

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
            successAction: SuccessSendMessage,
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

export const like_messages = (id, is_liked=true) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

        let options = {
            method : 'GET',
            headers,
        }

        let url = `http://127.0.0.1:8000/api/message/${id}/like/?is_liked=${is_liked}`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessLikeMessage,
            extraParams: {'id': id, 'is_liked': is_liked}
        })
    }
}

const SuccessLikeMessage = (data, extraParams) => {
    return (dispatch, getstate) =>{
        let state = getstate()
        let messages = state.message.list
        messages = messages.map((message) => {
            if(message.id == extraParams?.id){
                message.is_liked = extraParams?.is_liked
            }
            return message
        })
        dispatch({
            type: ADD_LIKE,
            payload: messages || []
        })
    }
}

export const reset_scroll = () => {
    return (dispatch, getstate) =>{
        dispatch({
            type: RESET_SCROLL,
        })
    }
}

export const delete_messages = (id) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

        let options = {
            method : 'DELETE',
            headers,
        }

        let url = `http://127.0.0.1:8000/api/message/${id}/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessDeleteMessage,
            extraParams: {'id': id}
        })
    }
}

const SuccessDeleteMessage = (extraParams) => {
    return (dispatch, getstate) =>{
        let state = getstate()
        let messages = state.message.list
        messages = messages.filter((message) => message.id != extraParams?.id)
        dispatch({
            type: ADD_LIKE,
            payload: messages || []
        })
        toast('deleted the message')
    }
}

export const edit_messages = (id, data) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

        let options = {
            method : 'PATCH',
            headers,
            body: JSON.stringify(data)
        }

        let url = `http://127.0.0.1:8000/api/message/${id}/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessEditMessage,
            extraParams: {'id': id}
        })
    }
}

const SuccessEditMessage = (data, extraParams) => {
    return (dispatch, getstate) =>{
        let state = getstate()
        let messages = state.message.list
        messages = messages.map((message) => {
            if(message.id == extraParams?.id){
                message.content = data?.content
            }
            return message
        })
        dispatch({
            type: ADD_LIKE,
            payload: messages || []
        })
    }
}