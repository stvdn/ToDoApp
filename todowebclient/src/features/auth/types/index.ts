export interface User {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    profile_picture?: string;
}

export interface AuthResponse {
    user: User;
}