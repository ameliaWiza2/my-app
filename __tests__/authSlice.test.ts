import {configureStore} from '@reduxjs/toolkit';
import authReducer, {
  login,
  restoreSession,
  signUp
} from '@/store/authSlice';
import {AuthService} from '@/services/authService';

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer
    }
  });

describe('authSlice', () => {
  beforeEach(() => {
    AuthService.__dangerous__reset();
    jest.clearAllMocks();
  });

  it('signs up a user successfully', async () => {
    const store = createStore();

    await store.dispatch(
      signUp({
        name: 'Alex Rivers',
        email: 'alex@example.com',
        password: 'password123'
      })
    );

    const state = store.getState().auth;

    expect(state.user).toMatchObject({
      name: 'Alex Rivers',
      email: 'alex@example.com'
    });
    expect(state.tokens).toBeTruthy();
    expect(state.status).toBe('succeeded');
  });

  it('returns error when login credentials are invalid', async () => {
    const store = createStore();

    await store.dispatch(
      login({email: 'nobody@example.com', password: 'bad-password'})
    );

    const state = store.getState().auth;

    expect(state.status).toBe('failed');
    expect(state.error).toMatch(/invalid email or password/i);
  });

  it('restores a session when tokens are stored securely', async () => {
    const store = createStore();

    await store.dispatch(
      signUp({
        name: 'Jamie Lee',
        email: 'jamie@example.com',
        password: 'password123'
      })
    );

    const createdState = store.getState().auth;
    expect(createdState.tokens).toBeTruthy();

    const nextStore = createStore();
    await nextStore.dispatch(restoreSession());

    const restoredState = nextStore.getState().auth;
    expect(restoredState.user).toMatchObject({email: 'jamie@example.com'});
    expect(restoredState.tokens).toBeTruthy();
    expect(restoredState.isRestoring).toBe(false);
  });
});
