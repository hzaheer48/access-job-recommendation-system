import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, ModalConfig, LoadingState } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  modal: ModalConfig;
  loading: LoadingState;
  theme: 'light' | 'dark';
}

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  showModal: (config: Partial<ModalConfig>) => void;
  hideModal: () => void;
  setLoading: (loading: Partial<LoadingState>) => void;
  toggleTheme: () => void;
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SHOW_MODAL'; payload: Partial<ModalConfig> }
  | { type: 'HIDE_MODAL' }
  | { type: 'SET_LOADING'; payload: Partial<LoadingState> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  modal: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  },
  loading: {
    isLoading: false,
  },
  theme: 'light',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    
    case 'LOGOUT':
      localStorage.removeItem('accessjobs_user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    
    case 'SHOW_MODAL':
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.payload,
          isOpen: true,
        },
      };
    
    case 'HIDE_MODAL':
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: false,
        },
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('accessjobs_theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document element
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Load persisted data on app start
  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('accessjobs_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('accessjobs_user');
      }
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('accessjobs_theme') as 'light' | 'dark' | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem('accessjobs_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const showModal = (config: Partial<ModalConfig>) => {
    dispatch({ type: 'SHOW_MODAL', payload: config });
  };

  const hideModal = () => {
    dispatch({ type: 'HIDE_MODAL' });
  };

  const setLoading = (loading: Partial<LoadingState>) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const value: AppContextType = {
    state,
    login,
    logout,
    showModal,
    hideModal,
    setLoading,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};