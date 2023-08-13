const Host = process.env.REACT_APP_HOST || 'http://127.0.0.1:8000/';

export const group_api = `${Host}/api/group`;
export const user_api = `${Host}/api/user`;
export const message_api = `${Host}/api/message`;
export const auth_api = `${Host}/api/auth`;
