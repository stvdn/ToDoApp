import { type User } from '../types';
import api from '../../../lib/axios';

export const registerUser = async (data: FormData): Promise<User> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
};

export const loginUser = async (credentials: any) => {
    // ... lógica de login
};