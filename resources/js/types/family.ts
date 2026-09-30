
export interface Spouse {
    id: number;
    family_member_id: number;
    name: string;
    gender: 'male' | 'female';
    birth_date: string | null;
    death_date: string | null;
    photo: string | null;
    status?: 'married' | 'divorced';
    created_at?: string;
    updated_at?: string;
}

export type FamilyMember = {
    id: number;
    name: string;
    gender: 'male' | 'female';
    birth_date: string | null;
    death_date: string | null;
    is_deceased: boolean;
    birth_place: string | null;
    bio: string | null;
    photo: string | null;
    parent_id: number | null;
    parent_spouse_id: number | null;
    generation: number;
    created_at: string;
    updated_at: string;
    parent?: FamilyMember | null;
    parentSpouse?: Spouse | null;
    spouses?: Spouse[];
    children?: FamilyMember[];
    children_recursive?: FamilyMember[];
    mosaics?: FamilyMosaic[];
    tagged_mosaics?: FamilyMosaic[];
};

export type FamilyTreeStats = {
    totalMembers: number;
    totalGenerations: number;
    totalMale?: number;
    totalFemale?: number;
    totalSpouses?: number;
};

export interface FamilyMosaic {
    id: number;
    user_id: number;
    family_member_id: number;
    title: string | null;
    caption: string;
    photo_path: string;
    thumbnail_path: string;
    activity_date: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        role: string;
    };
    family_member?: FamilyMember;
    tagged_members?: FamilyMember[];
    can_manage?: boolean;
}
