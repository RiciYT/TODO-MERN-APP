import {
  SIGNUP_USER,
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER,
  AUTH_FAIL,
  CLEAR_ERROR,
  SET_LOADING,
} from '../types';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  loading: boolean;
  isRegistered: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

type AuthAction =
  | { type: typeof GET_USER; payload: User }
  | { type: typeof SIGNUP_USER; payload: unknown }
  | { type: typeof LOGIN_USER; payload: { token: string } }
  | { type: typeof LOGOUT_USER }
  | { type: typeof AUTH_FAIL; payload: string | null }
  | { type: typeof CLEAR_ERROR }
  | { type: typeof SET_LOADING };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };

    case SIGNUP_USER:
      return {
        ...state,
        isRegistered: true,
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    case LOGIN_USER:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case LOGOUT_USER:
    case AUTH_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'payload' in action ? action.payload : null,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export default authReducer;
