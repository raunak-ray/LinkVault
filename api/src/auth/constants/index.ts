export const AVATAR_URL =
  'https://api.dicebear.com/10.x/avataaars/svg?seed=' as const;

export const AuthProvider = {
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

export const AuthProviderValues = Object.values(AuthProvider);