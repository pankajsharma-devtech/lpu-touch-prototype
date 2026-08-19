import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import type { StudentProfile } from '../data/types';

const STORAGE_KEY = 'lpu-touch-prototype:profile';

/**
 * Bump this whenever the shape or the DEFAULT_PROFILE contents change in a
 * way that shouldn't be silently inherited from an older localStorage entry
 * (e.g. the earlier prototype build shipped real personal information as its
 * default profile — anyone who ran that build has it sitting in their own
 * browser's localStorage). Any stored profile that isn't tagged with the
 * current version is treated as untrusted and discarded in favor of the
 * current safe DEFAULT_PROFILE, rather than merged with it.
 */
const PROFILE_VERSION = 2;

interface StoredProfileEnvelope {
  version: number;
  data: StudentProfile;
}

interface ProfileContextValue {
  profile: StudentProfile;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;

    const parsed: unknown = JSON.parse(raw);
    const isVersionedEnvelope =
      parsed !== null &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      'data' in parsed;

    if (isVersionedEnvelope) {
      const envelope = parsed as StoredProfileEnvelope;
      if (envelope.version === PROFILE_VERSION) {
        // merge with defaults so any newly-added fields don't break old saved data
        return { ...DEFAULT_PROFILE, ...envelope.data };
      }
    }

    // Unversioned or outdated-version data (including data saved by the
    // previous build, before the default profile was anonymized) is
    // intentionally NOT merged with the new defaults — it's discarded
    // entirely so no old field can leak through.
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);

  useEffect(() => {
    try {
      const envelope: StoredProfileEnvelope = { version: PROFILE_VERSION, data: profile };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch {
      // localStorage unavailable — silently continue, in-memory state still works
    }
  }, [profile]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      updateProfile: (patch) => setProfile((prev) => ({ ...prev, ...patch })),
      resetProfile: () => setProfile(DEFAULT_PROFILE),
    }),
    [profile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
