import { memo } from "react";
import {
    ADD_NEW_GROUP,
    ADD_INITIAL_GROUPS_DATA,
    ADD_GROUPS_DATA,
    NEW_GROUP_CREATION,
    CHANGE_SELECTED_GROUP_ID,
    MEMBER_ADDITION
} from "../reducers/GroupReducer";
import { toast } from "react-toastify";


export const get_groups = (name='') => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json',
        })

        let options = {
            method : 'GET',
            headers
        }

        let url = `http://127.0.0.1:8000/api/group/?name=${name}`

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

export const close_new_group_modal = () => {
    return (dispatch, getstate) =>{
        dispatch({
            type: NEW_GROUP_CREATION,
            payload: false
        })
    }
}

export const open_new_group_modal = () => {
    return (dispatch, getstate) =>{
        dispatch({
            type: NEW_GROUP_CREATION,
            payload: true
        })
    }
}

export const create_group = (data) => {
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

        let url = `http://127.0.0.1:8000/api/group/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessGroupCreate,
            failureAction: FailGroupCreate
        })
    }
}

const SuccessGroupCreate = (data) => {
    return (dispatch, getstate) =>{
        dispatch({
            type: ADD_NEW_GROUP,
            payload: data || []
        })

        dispatch(close_new_group_modal())
        toast('New Group Created')
    }
}

const FailGroupCreate = (data) => {
    return (dispatch, getstate) =>{
        if (data?.error){
            toast(data.error)
        }
        else
            toast('Check all fields before submissoin')
    }
}

export const edit_group = (id, data) => {
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

        let url = `http://127.0.0.1:8000/api/group/${id}/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessEditGroup,
            extraParams: {'id': id}
        })
    }
}

const SuccessEditGroup = (data, extraParams) => {
    return (dispatch, getstate) =>{
        let state = getstate()
        let groups = state.group.list
        groups = groups.map((group) => {
            if(group.id == extraParams?.id){
                group = data
            }
            return group
        })
        dispatch({
            type: ADD_GROUPS_DATA,
            payload: groups || []
        })
        dispatch(set_selected_group(data.id, data.name))
    }
}

export const get_group_info = (id) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

        let options = {
            method : 'GET',
            headers,
        }

        let url = `http://127.0.0.1:8000/api/group/${id}/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessEditGroup,
            extraParams: {'id': id}
        })
    }
}

export const delete_group = (id) => {
    return (dispatch, getState) => {
        let state = getState()
        let headers = new Headers({
            'Content-Type': 'application/json'
        })
        

        let options = {
            method : 'DELETE',
            headers,
        }

        let url = `http://127.0.0.1:8000/api/group/${id}/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessDeleteGroup,
            extraParams: {'id': id}
        })
    }
}

const SuccessDeleteGroup = (extraParams) => {
    return (dispatch, getstate) =>{
        let state = getstate()
        let groups = state.group.list
        groups = groups.filter((group) => group.id != extraParams?.id)
        dispatch({
            type: ADD_GROUPS_DATA,
            payload: groups || []
        })
        toast('deleted the group')
    }
}

export const close_member_addition = () => {
    return (dispatch, getstate) =>{
        dispatch({
            type: MEMBER_ADDITION,
            payload: false
        })
    }
}

export const open_member_addition = () => {
    return (dispatch, getstate) =>{
        dispatch({
            type: MEMBER_ADDITION,
            payload: true
        })
    }
}

export const add_group_member = (id, data) => {
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

        let url = `http://127.0.0.1:8000/api/group/${id}/add_member/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: SuccessAddMember,
            extraParams: {'id': id}
        })
    }
}

const SuccessAddMember = (data, extraParams) => {
    return (dispatch, getstate) => {
        dispatch(get_group_info(extraParams?.id))
    }
}

export const remove_group_member = (id, data) => {
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

        let url = `http://127.0.0.1:8000/api/group/${id}/remove_member/`

        dispatch({
            type: 'API',
            options: options,
            url: url,
            successAction: UpdateGroupMember,
            extraParams: {'id': id, 'member_id': data?.member_id}
        })
    }
}

const UpdateGroupMember = (data, extraParams) => {
    return (dispatch, getState) => {
        let state = getState()
        let groups = state.group.list
        groups = groups.map((group) => {
            if(group.id == extraParams?.id){
                group.members = group.members.filter(member => member.id != extraParams?.member_id)
            }
            return group
        })
        dispatch({
            type: ADD_GROUPS_DATA,
            payload: groups || []
        })
        toast('deleted member')
    }
}