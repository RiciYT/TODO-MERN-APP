import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import axios, { AxiosError } from 'axios';

import setAuthToken from '../../utils/SetAuthToken';
import {
  SIGNUP_USER,
  LOGIN_USER,
  GET_USER,
  AUTH_FAIL,
  SET_LOADING,
  CLEAR_ERROR,
  LOGOUT_USER,
} from '../types';
import AuthReducer from './AuthReducer';
import AuthContext from './AuthContext';
import { User } from '../../types/user';

type AuthProviderProps = {
  children: ReactNode;
};

type AuthErrorResponse = {
  error: string;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialState = {
    user: null,
    loading: false,
    isRegistered: false,
    isAuthenticated: false,
    error: null as string | null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const url = import.meta.env.VITE_BACKEND_URL;

  const getErrorMessage = (err: unknown) =>
    (err as AxiosError<AuthErrorResponse>).response?.data?.error ??
    'Request failed';

  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      return;
    }
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.get(url + '/user/auth');

      dispatch({
        type: GET_USER,
        payload: res.data,
      });
    } catch (err: unknown) {
      dispatch({ type: AUTH_FAIL, payload: getErrorMessage(err) });
    }
  }, [url]);

  const signup = async (user: User) => {
    try {
      dispatch({ type: SET_LOADING });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post(url + '/user/signup', user, config);
      dispatch({
        type: SIGNUP_USER,
        payload: res.data,
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      dispatch({
        type: AUTH_FAIL,
        payload: message,
      });
      throw new Error(message);
    }
  };

  const signin = async (user: User) => {
    try {
      dispatch({ type: SET_LOADING });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post(url + '/user/signin', user, config);
      dispatch({
        type: LOGIN_USER,
        payload: res.data,
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      dispatch({
        type: AUTH_FAIL,
        payload: message,
      });
      throw new Error(message);
    }
  };

  const logout = () => {
    dispatch({ type: SET_LOADING });
    dispatch({ type: LOGOUT_USER });
  };

  const clearError = () => {
    dispatch({
      type: CLEAR_ERROR,
    });
  };

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        loading: state.loading,
        user: state.user,
        isRegistered: state.isRegistered,
        isAuthenticated: state.isAuthenticated,
        error: state.error ?? undefined,
        signup,
        signin,
        logout,
        loadUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
