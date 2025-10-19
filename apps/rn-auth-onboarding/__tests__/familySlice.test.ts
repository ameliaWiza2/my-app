import {configureStore} from '@reduxjs/toolkit';
import authReducer, {signUp} from '@/store/authSlice';
import familyReducer, {
  confirmJoinFamily,
  createFamily,
  previewInvitation
} from '@/store/familySlice';
import {AuthService} from '@/services/authService';
import {FamilyService} from '@/services/familyService';

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      family: familyReducer
    }
  });

describe('familySlice', () => {
  beforeEach(() => {
    AuthService.__dangerous__reset();
    FamilyService.__dangerous__reset();
    jest.clearAllMocks();
  });

  it('creates a family for the authenticated user', async () => {
    const store = createStore();

    await store.dispatch(
      signUp({
        name: 'Owner One',
        email: 'owner@example.com',
        password: 'password123'
      })
    );

    await store.dispatch(createFamily({name: 'The Ones'}));

    const state = store.getState().family;
    expect(state.family).toMatchObject({name: 'The Ones'});
    expect(state.onboardingComplete).toBe(true);
  });

  it('previews and joins a family using an invitation code', async () => {
    const ownerStore = createStore();

    await ownerStore.dispatch(
      signUp({
        name: 'Owner Two',
        email: 'owner2@example.com',
        password: 'password123'
      })
    );

    await ownerStore.dispatch(createFamily({name: 'The Twos'}));

    const invitationCode = ownerStore.getState().family.family?.invitationCode;
    expect(invitationCode).toBeTruthy();

    const joinerStore = createStore();

    await joinerStore.dispatch(
      signUp({
        name: 'Joiner',
        email: 'joiner@example.com',
        password: 'password123'
      })
    );

    await joinerStore.dispatch(previewInvitation({code: invitationCode!}));

    const preview = joinerStore.getState().family.invitationPreview;
    expect(preview).toMatchObject({familyName: 'The Twos'});

    await joinerStore.dispatch(confirmJoinFamily({code: invitationCode!}));

    const familyState = joinerStore.getState().family;
    expect(familyState.family?.members.length).toBe(2);
    expect(familyState.onboardingComplete).toBe(true);
  });
});
