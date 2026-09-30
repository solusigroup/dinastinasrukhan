export type UserRole = 'superadmin' | 'editor' | 'viewer' | 'pending';
export type UserStatus = 'active' | 'pending' | 'rejected';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    role: UserRole;
    status: UserStatus;
    approved_at: string | null;
    approved_by: number | null;
    created_at: string;
    updated_at: string;
    is_superadmin?: boolean;
    can_chat?: boolean;
    branch_assignments_count?: number;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
