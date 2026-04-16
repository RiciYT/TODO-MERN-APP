import { createContext } from 'react';

import type { TodoState } from '@/types/todo';

const noop = () => undefined;

const TodoContext = createContext<TodoState>({
  todos: [],
  todoLoading: false,
  loading: false,
  error: null,
  getTodos: noop,
  createTodo: noop,
  markComplete: noop,
  clearError: noop,
  deleteTodo: noop,
});

export default TodoContext;
