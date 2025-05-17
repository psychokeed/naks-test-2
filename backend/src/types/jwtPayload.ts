export interface JwtPayload {
  id: string;
  role: 'client' | 'admin';
}
