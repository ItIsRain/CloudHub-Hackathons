export type UserRole = 'organizer' | 'participant' | 'judge' | 'mentor' | 'media';

export interface User {
    id: string;
    email: string;
    name: string;
    full_name: string;
    role: UserRole;
    status: string;
    created_at: string;
    last_login: string;
    is_verified: boolean;
    phone?: string;
    country?: string;
    timezone?: string;
    bio?: string;
    avatar?: string;
    skills?: string[];
    languages?: Array<{
        language: string;
        level: string;
    }>;
    certifications?: any[];
    social_links?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    organization_name?: string;
    organization_website?: string;
    organization_size?: string;
    industry?: string;
    specializations?: string[];
    mentorship_areas?: string[];
    is_online?: boolean;
    last_seen?: string;
    is_team_lead?: boolean;
    permissions?: string[];
    active_hackathons?: string[];
    completed_hackathons?: string[];
    active_teams?: string[];
    rating?: number;
    achievement_count?: number;
    reputation_score?: number;
    communication_preferences?: any;
    notification_settings?: any;
    availability?: any;
    phone_verified?: boolean;
    full_context?: {
        id: string;
        email: string;
        name: string;
        organization_name: string;
    };
    updated_at?: string;
} 