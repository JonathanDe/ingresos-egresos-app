import * as fromAuth from './auth.actions';
import { User } from './user.model';

export interface AuthState {
  autenticado?: boolean;
  user: User;
}

const initialState: AuthState = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: fromAuth.acciones,
): AuthState {
  switch (action.type) {
    case fromAuth.SET_USER:
      return {
        user: {...action.user}
      };
    default:
      return state;
  }
}
