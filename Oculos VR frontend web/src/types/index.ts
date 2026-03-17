export interface User {
  email: string;
  full_name: string | null;
  username: string | null;
  role: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
