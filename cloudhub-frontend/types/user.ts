export type UserRole = 'admin' | 'organizer' | 'participant' | 'judge';

export interface User {
    id: string;
    email: string;
    name: string;
    full_name?: string;
    role: UserRole;
    status: string;
    email_verified: boolean;
    phone_verified?: boolean;
    avatar?: string;
    phone?: string;
    organization_name?: string;
    created_at: string;
    updated_at: string;
} 