import type {Family, InvitationPreview} from '@/types';

const familiesById = new Map<string, Family>();
const invitationDirectory = new Map<string, string>();

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const randomString = () => Math.random().toString(36).slice(2, 10);

interface CreateFamilyPayload {
  name: string;
  ownerId: string;
}

interface JoinFamilyPayload {
  code: string;
  userId: string;
}

export const FamilyService = {
  async createFamily({name, ownerId}: CreateFamilyPayload): Promise<Family> {
    await delay();

    const familyId = `family-${randomString()}`;
    const invitationCode = randomString().toUpperCase();

    const family: Family = {
      id: familyId,
      name: name.trim(),
      members: [ownerId],
      invitationCode
    };

    familiesById.set(familyId, family);
    invitationDirectory.set(invitationCode, familyId);

    return family;
  },

  async previewInvitation(code: string): Promise<InvitationPreview> {
    await delay();

    const normalizedCode = code.trim().toUpperCase();
    const familyId = invitationDirectory.get(normalizedCode);

    if (!familyId) {
      throw new Error('Invitation code not found.');
    }

    const family = familiesById.get(familyId);

    if (!family) {
      throw new Error('Family not available.');
    }

    return {
      code: normalizedCode,
      familyName: family.name,
      memberCount: family.members.length
    };
  },

  async joinFamily({code, userId}: JoinFamilyPayload): Promise<Family> {
    await delay();

    const normalizedCode = code.trim().toUpperCase();
    const familyId = invitationDirectory.get(normalizedCode);

    if (!familyId) {
      throw new Error('Invitation code not found.');
    }

    const family = familiesById.get(familyId);

    if (!family) {
      throw new Error('Family not available.');
    }

    if (!family.members.includes(userId)) {
      family.members = [...family.members, userId];
      familiesById.set(familyId, family);
    }

    return family;
  },

  async getFamilyForUser(userId: string): Promise<Family | null> {
    await delay(150);

    for (const family of familiesById.values()) {
      if (family.members.includes(userId)) {
        return family;
      }
    }

    return null;
  },

  __dangerous__reset() {
    familiesById.clear();
    invitationDirectory.clear();
  }
};

export type FamilyServiceType = typeof FamilyService;
