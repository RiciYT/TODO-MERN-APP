import { createContext } from 'react';

import type { UserState } from '@/types/user';

const noop = () => undefined;

const AuthContext = createContext<UserState>({
  clearError: noop,
  signup: noop,
  signin: noop,
  logout: noop,
  loadUser: noop,
  loading: false,
  error: undefined,
  user: null,
  isAuthenticated: false,
  isRegistered: false,
});

export default AuthContext;
