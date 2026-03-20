import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { User } from '@/types/auth';
import { AuthResponseSchema } from '@/schemas/auth';

interface AuthResponse {
    user: User;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const authService = {
    /** Authentifie l'utilisateur avec email et mot de passe */
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', payload);
        const validated = AuthResponseSchema.parse(response.data);
        tokenStorage.setToken(validated.token);
        return { user: validated.user };
    },

    /** Crée un nouveau compte utilisateur */
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', payload);
        const validated = AuthResponseSchema.parse(response.data);
        tokenStorage.setToken(validated.token);
        return { user: validated.user };
    },

    /** Révoque le token Sanctum côté serveur */
    logout: () =>
        api.post('/auth/logout'),

    /** Demande un lien de réinitialisation de mot de passe */
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),

    /** Réinitialise le mot de passe avec le token reçu par email */
    resetPassword: (payload: Record<string, unknown>) =>
        api.post('/auth/reset-password', payload),
};
