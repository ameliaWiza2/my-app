import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Family, FamilyMember, FamilyService, FamilyRole } from '../../services/family';

export type FamilyState = {
  family: Family | null;
  members: FamilyMember[];
  loading: boolean;
  error: string | null;
  inviteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  roleUpdateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  removeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export type FamilyAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { family: Family; members: FamilyMember[] } }
  | { type: 'LOAD_FAILURE'; error: string }
  | { type: 'INVITE_START' }
  | { type: 'INVITE_SUCCESS' }
  | { type: 'INVITE_FAILURE'; error: string }
  | { type: 'ROLE_UPDATE_START'; payload: { memberId: string; newRole: FamilyRole } }
  | { type: 'ROLE_UPDATE_ROLLBACK'; payload: { memberId: string; prevRole: FamilyRole } }
  | { type: 'ROLE_UPDATE_SUCCESS' }
  | { type: 'ROLE_UPDATE_FAILURE'; error: string }
  | { type: 'REMOVE_START'; payload: { memberId: string; prev: FamilyMember } }
  | { type: 'REMOVE_ROLLBACK'; payload: { prev: FamilyMember } }
  | { type: 'REMOVE_SUCCESS' }
  | { type: 'REMOVE_FAILURE'; error: string };

export const initialFamilyState: FamilyState = {
  family: null,
  members: [],
  loading: false,
  error: null,
  inviteStatus: 'idle',
  roleUpdateStatus: 'idle',
  removeStatus: 'idle',
};

export const familyReducer = (state: FamilyState, action: FamilyAction): FamilyState => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        family: action.payload.family,
        members: action.payload.members,
      };
    case 'LOAD_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'INVITE_START':
      return { ...state, inviteStatus: 'loading', error: null };
    case 'INVITE_SUCCESS':
      return { ...state, inviteStatus: 'succeeded' };
    case 'INVITE_FAILURE':
      return { ...state, inviteStatus: 'failed', error: action.error };
    case 'ROLE_UPDATE_START': {
      const { memberId, newRole } = action.payload;
      return {
        ...state,
        roleUpdateStatus: 'loading',
        members: state.members.map(m => (m.id === memberId ? { ...m, role: newRole } : m)),
      };
    }
    case 'ROLE_UPDATE_ROLLBACK': {
      const { memberId, prevRole } = action.payload;
      return {
        ...state,
        members: state.members.map(m => (m.id === memberId ? { ...m, role: prevRole } : m)),
      };
    }
    case 'ROLE_UPDATE_SUCCESS':
      return { ...state, roleUpdateStatus: 'succeeded' };
    case 'ROLE_UPDATE_FAILURE':
      return { ...state, roleUpdateStatus: 'failed', error: action.error };
    case 'REMOVE_START': {
      const { memberId } = action.payload;
      return {
        ...state,
        removeStatus: 'loading',
        members: state.members.filter(m => m.id !== memberId),
      };
    }
    case 'REMOVE_ROLLBACK':
      return { ...state, members: [...state.members, action.payload.prev] };
    case 'REMOVE_SUCCESS':
      return { ...state, removeStatus: 'succeeded' };
    case 'REMOVE_FAILURE':
      return { ...state, removeStatus: 'failed', error: action.error };
    default:
      return state;
  }
};

export const useFamily = () => {
  const [state, dispatch] = useReducer(familyReducer, initialFamilyState);

  const load = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_START' });
      const [family, members] = await Promise.all([FamilyService.getFamily(), FamilyService.listMembers()]);
      dispatch({ type: 'LOAD_SUCCESS', payload: { family, members } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load family';
      dispatch({ type: 'LOAD_FAILURE', error: msg });
    }
  }, []);

  const invite = useCallback(
    async (email: string) => {
      try {
        if (!state.family) throw new Error('No family');
        dispatch({ type: 'INVITE_START' });
        await FamilyService.inviteMember(state.family.id, email);
        dispatch({ type: 'INVITE_SUCCESS' });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to invite member';
        dispatch({ type: 'INVITE_FAILURE', error: msg });
      }
    },
    [state.family],
  );

  const updateRole = useCallback(
    async (memberId: string, role: FamilyRole) => {
      if (!state.family) return;
      const prev = state.members.find(m => m.id === memberId)?.role ?? 'viewer';
      dispatch({ type: 'ROLE_UPDATE_START', payload: { memberId, newRole: role } });
      try {
        await FamilyService.updateMemberRole(state.family.id, memberId, role);
        dispatch({ type: 'ROLE_UPDATE_SUCCESS' });
      } catch (e) {
        dispatch({ type: 'ROLE_UPDATE_ROLLBACK', payload: { memberId, prevRole: prev as FamilyRole } });
        const msg = e instanceof Error ? e.message : 'Failed to update role';
        dispatch({ type: 'ROLE_UPDATE_FAILURE', error: msg });
      }
    },
    [state.family, state.members],
  );

  const remove = useCallback(
    async (memberId: string) => {
      if (!state.family) return;
      const prev = state.members.find(m => m.id === memberId);
      if (!prev) return;
      dispatch({ type: 'REMOVE_START', payload: { memberId, prev } });
      try {
        await FamilyService.removeMember(state.family.id, memberId);
        dispatch({ type: 'REMOVE_SUCCESS' });
      } catch (e) {
        dispatch({ type: 'REMOVE_ROLLBACK', payload: { prev } });
        const msg = e instanceof Error ? e.message : 'Failed to remove member';
        dispatch({ type: 'REMOVE_FAILURE', error: msg });
      }
    },
    [state.family, state.members],
  );

  useEffect(() => {
    // auto load on first use
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      state,
      load,
      invite,
      updateRole,
      remove,
    }),
    [state, load, invite, updateRole, remove],
  );
};
