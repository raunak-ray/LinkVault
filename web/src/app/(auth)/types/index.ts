export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
}

export interface AuthUser extends User {
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshExpiry: Date;
}
