import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Login from '@/components/User/Login';
import Signup from '@/components/User/Signup';
import TodoLayout from '@/components/Todo/TodoLayout';
import AuthContext from '@/context/auth/AuthContext';
import TodoContext from '@/context/todo/TodoContext';
import type { UserState } from '@/types/user';
import type { TodoState } from '@/types/todo';

const authValue: UserState = {
  clearError: vi.fn(),
  signup: vi.fn(),
  signin: vi.fn(),
  logout: vi.fn(),
  loadUser: vi.fn(),
  isAuthenticated: false,
  isRegistered: false,
  loading: false,
  error: undefined,
  user: null,
};

const todoValue: TodoState = {
  todos: [
    {
      _id: '1',
      title: 'Write copy',
      description: 'Tighten up the dashboard text',
      completed: false,
    },
  ],
  todoLoading: false,
  loading: false,
  error: null,
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  markComplete: vi.fn(),
  clearError: vi.fn(),
  deleteTodo: vi.fn(),
};

function renderWithProviders(
  ui: ReactNode,
  authOverride: Partial<UserState> = {},
  todoOverride: Partial<TodoState> = {}
) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...authValue, ...authOverride }}>
        <TodoContext.Provider value={{ ...todoValue, ...todoOverride }}>
          {ui}
        </TodoContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('redesign surfaces', () => {
  it('renders a calmer login workspace with product framing', () => {
    renderWithProviders(<Login />);

    expect(
      screen.getByRole('heading', { name: /sign in and pick up where you left off/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/a spare workspace for planning, not a marketing page/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders signup as a structured account setup screen', () => {
    renderWithProviders(<Signup />);

    expect(
      screen.getByRole('heading', { name: /create your account and start organizing work/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders the todo workspace with composer and task list sections', () => {
    renderWithProviders(<TodoLayout />);

    expect(screen.getByRole('heading', { name: /task workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /create a task/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /inbox/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });
});
