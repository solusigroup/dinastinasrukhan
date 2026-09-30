export type ChatMessage = {
    id: number;
    sender_id: number;
    recipient_id: number;
    message: string;
    is_broadcast: boolean;
    read_at: string | null;
    created_at: string;
};

export type ChatContact = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    unread_count: number;
    last_message: {
        id: number;
        message: string;
        is_broadcast: boolean;
        sender_id: number;
        created_at: string;
    } | null;
};
