export type UserRole = 'organizer' | 'participant' | 'judge' | 'mentor' | 'media' | 'admin';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    email_verified: boolean;
    phone_verified?: boolean;
    organization_name?: string;
    created_at: string;
    updated_at: string;
} 