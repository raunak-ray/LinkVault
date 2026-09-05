export const AuthProvider = {
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

export type AuthProviderType = (typeof AuthProvider)[keyof typeof AuthProvider];
