export type SigninCredentials = {
  email: string;
  password: string;
  role?: any;

};

export type SigninCredentialsResponse = {
  token?: string;
  user?: any;
  role?: any;
};

export interface AdminLoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
  expiresIn: string;
  role: string;
  permissions: string[];
}