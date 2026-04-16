import {
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  MARK_COMPLETE,
  TODO_FAIL,
  SET_LOADING,
  SET_TODO_LOADING,
  CLEAR_ERROR,
} from '../types';
import type { Todo } from '@/types/todo';

type TodoStateShape = {
  todos: Todo[];
  loading: boolean;
  todoLoading: boolean;
  error: string | null;
};

type TodoAction =
  | { type: typeof SET_LOADING }
  | { type: typeof SET_TODO_LOADING }
  | { type: typeof GET_TODOS; payload: Todo[] }
  | { type: typeof CREATE_TODO; payload: Todo }
  | { type: typeof DELETE_TODO; payload: string }
  | { type: typeof MARK_COMPLETE; payload: string }
  | { type: typeof TODO_FAIL; payload: string | null }
  | { type: typeof CLEAR_ERROR };

function todoReducer(state: TodoStateShape, action: TodoAction): TodoStateShape {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_TODO_LOADING:
      return {
        ...state,
        todoLoading: true,
      };

    case GET_TODOS:
      return {
        ...state,
        todos: action.payload,
        todoLoading: false,
      };

    case CREATE_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
        loading: false,
      };

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo._id !== action.payload),
        loading: false,
      };

    case MARK_COMPLETE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo._id === action.payload ? { ...todo, completed: true } : todo
        ),
        loading: false,
      };

    case TODO_FAIL:
      return {
        ...state,
        loading: false,
        todoLoading: false,
        error: action.payload ?? null,
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

export default todoReducer;
