import { AuthProvider } from 'src/db/schema';

export type AuthProviderType = (typeof AuthProvider)[keyof typeof AuthProvider];
