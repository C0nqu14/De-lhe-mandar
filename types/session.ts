export type UserRole = 'CLIENT' | 'EXECUTOR';

export type MockSession = { userId: string; role: UserRole; displayName: string };