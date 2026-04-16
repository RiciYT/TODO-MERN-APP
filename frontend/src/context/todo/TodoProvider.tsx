import { ReactNode, useCallback, useMemo, useReducer } from 'react';
import axios, { AxiosError } from 'axios';

import {
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  TODO_FAIL,
  CLEAR_ERROR,
  MARK_COMPLETE,
  SET_LOADING,
  SET_TODO_LOADING,
} from '../types';
import TodoReducer from './TodoReducer';
import TodoContext from './TodoContext';
import { Todo } from '../../types/todo';
import setAuthToken from '../../utils/SetAuthToken';

type TodoProviderProps = {
  children: ReactNode;
};

type TodoErrorResponse = {
  error: string;
};

const TodoProvider = ({ children }: TodoProviderProps) => {
  const initialState = {
    todos: [] as Todo[],
    loading: false,
    todoLoading: false,
    error: null as string | null,
  };

  const [state, dispatch] = useReducer(TodoReducer, initialState);

  const url = import.meta.env.VITE_BACKEND_URL;

  const getErrorMessage = useCallback((err: unknown) =>
    (err as AxiosError<TodoErrorResponse>).response?.data?.error ??
    'Request failed', []);

  const getTodos = useCallback(async () => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      dispatch({ type: SET_TODO_LOADING });

      const res = await axios.get(url + '/todos');
      dispatch({
        type: GET_TODOS,
        payload: res.data.todos,
      });
    } catch (err: unknown) {
      dispatch({
        type: TODO_FAIL,
        payload: getErrorMessage(err),
      });
    }
  }, [getErrorMessage, url]);

  const createTodo = useCallback(async (todo: Todo) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      dispatch({
        type: SET_LOADING,
      });
      const res = await axios.post(url + '/todos', todo);
      dispatch({
        type: CREATE_TODO,
        payload: {
          title: res.data.todo.title,
          description: res.data.todo.description,
          completed: res.data.todo.completed,
          _id: res.data.todo._id,
          createdAt: res.data.todo.createdAt,
        },
      });
    } catch (err: unknown) {
      dispatch({
        type: TODO_FAIL,
        payload: getErrorMessage(err),
      });
    }
  }, [getErrorMessage, url]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      dispatch({
        type: SET_LOADING,
      });
      dispatch({
        type: DELETE_TODO,
        payload: id,
      });
      await axios.delete(url + `/todos/${id}`);
    } catch (err: unknown) {
      dispatch({
        type: TODO_FAIL,
        payload: getErrorMessage(err),
      });
    }
  }, [getErrorMessage, url]);

  const markComplete = useCallback(async (id: string) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      dispatch({
        type: MARK_COMPLETE,
        payload: id,
      });
      await axios.put(url + '/todos', {
        id,
      });
    } catch (err: unknown) {
      dispatch({
        type: TODO_FAIL,
        payload: getErrorMessage(err),
      });
    }
  }, [getErrorMessage, url]);

  const clearError = useCallback(() => {
    dispatch({
      type: CLEAR_ERROR,
    });
  }, []);

  const value = useMemo(() => ({
    todoLoading: state.todoLoading,
    loading: state.loading,
    todos: state.todos,
    error: state.error,
    createTodo,
    markComplete,
    clearError,
    getTodos,
    deleteTodo,
  }), [
    clearError,
    createTodo,
    deleteTodo,
    getTodos,
    markComplete,
    state.error,
    state.loading,
    state.todoLoading,
    state.todos,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
