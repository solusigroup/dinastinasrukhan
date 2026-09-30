import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCheck,
    Megaphone,
    MessageSquare,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ChatContact, ChatMessage, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pesan & Obrolan', href: '/chat' },
];

type PageProps = {
    contacts: ChatContact[];
    selectedUser: ChatContact | null;
    messages: ChatMessage[];
    totalActiveUsersCount: number;
    flash: { success?: string; error?: string };
    auth: { user: User & { is_superadmin: boolean } };
};

const roleLabels: Record<string, { text: string; class: string }> = {
    superadmin: {
        text: 'Superadmin',
        class: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
    },
    editor: {
        text: 'Editor',
        class: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    },
    viewer: {
        text: 'Viewer',
        class: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
    },
    pending: {
        text: 'Pending',
        class: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    },
};

const getAvatarGradient = (role: string) => {
    switch (role) {
        case 'superadmin':
            return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
        case 'editor':
            return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white';
        case 'viewer':
            return 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white';
        default:
            return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white';
    }
};

export default function ChatIndex() {
    const {
        contacts,
        selectedUser,
        messages,
        totalActiveUsersCount,
        flash,
        auth,
    } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [activeUser, setActiveUser] = useState<ChatContact | null>(
        selectedUser,
    );
    const [messageList, setMessageList] = useState<ChatMessage[]>(messages);
    const [inputMessage, setInputMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showMobileList, setShowMobileList] = useState(!selectedUser);

    // Bulk broadcast modal state
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkMessage, setBulkMessage] = useState('');
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [bulkError, setBulkError] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isSuperadmin =
        auth.user.is_superadmin || auth.user.role === 'superadmin';

    // Synchronize when Inertia props update
    useEffect(() => {
        setActiveUser(selectedUser);
        setMessageList(messages);
    }, [selectedUser, messages]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    // Background polling for new messages every 3.5 seconds
    useEffect(() => {
        if (!activeUser) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/chat/${activeUser.id}/messages`, {
                    headers: { Accept: 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && Array.isArray(data.messages)) {
                        setMessageList(data.messages);
                    }
                }
            } catch {
                // Silently ignore polling errors
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [activeUser?.id]);

    const handleSelectContact = (contact: ChatContact) => {
        setActiveUser(contact);
        setShowMobileList(false);
        router.get(
            '/chat',
            { user_id: contact.id },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputMessage.trim();
        if (!text || !activeUser || isSending) return;

        setIsSending(true);

        // Optimistic UI update
        const tempMsg: ChatMessage = {
            id: Date.now(),
            sender_id: auth.user.id,
            recipient_id: activeUser.id,
            message: text,
            is_broadcast: false,
            read_at: null,
            created_at: new Date().toISOString(),
        };
        setMessageList((prev) => [...prev, tempMsg]);
        setInputMessage('');

        router.post(
            `/chat/${activeUser.id}`,
            { message: text },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsSending(false);
                },
            },
        );
    };

    const handleSendBulk = (e: React.FormEvent) => {
        e.preventDefault();
        const text = bulkMessage.trim();
        if (!text) {
            setBulkError('Isi pesan massal tidak boleh kosong.');
            return;
        }

        setIsSendingBulk(true);
        setBulkError('');

        router.post(
            '/chat/bulk-broadcast',
            { message: text },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowBulkModal(false);
                    setBulkMessage('');
                },
                onError: (errors) => {
                    setBulkError(
                        errors.message || 'Gagal mengirim pesan massal.',
                    );
                },
                onFinish: () => {
                    setIsSendingBulk(false);
                },
            },
        );
    };

    const filteredContacts = contacts.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()),
    );

    const formatMessageTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatContactTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();

        if (isToday) {
            return d.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesan & Obrolan" />

            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col overflow-hidden p-4 sm:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Main Chat Box Container */}
                <div className="flex flex-1 overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-sm">
                    {/* Contacts Sidebar (Left) */}
                    <div
                        className={`flex w-full flex-col border-r border-sidebar-border/70 md:w-80 lg:w-96 ${
                            !showMobileList ? 'hidden md:flex' : 'flex'
                        }`}
                    >
                        {/* Sidebar Header */}
                        <div className="flex flex-col gap-3 border-b border-sidebar-border/70 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <h2 className="font-bold text-foreground">
                                        Obrolan
                                    </h2>
                                </div>

                                {/* Superadmin Bulk Chat Button */}
                                {isSuperadmin && (
                                    <button
                                        onClick={() => {
                                            setShowBulkModal(true);
                                            setBulkError('');
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-600 active:scale-95"
                                        title="Kirim pesan massal ke seluruh pengguna"
                                    >
                                        <Megaphone className="h-3.5 w-3.5" />
                                        Siaran Massal
                                    </button>
                                )}
                            </div>

                            {/* Search Contacts */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari pengguna..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-xs transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 divide-y divide-sidebar-border/40 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <Users className="mb-2 h-8 w-8 opacity-30" />
                                    <p className="text-xs">
                                        Tidak ada kontak ditemukan.
                                    </p>
                                </div>
                            ) : (
                                filteredContacts.map((contact) => {
                                    const isSelected =
                                        activeUser?.id === contact.id;
                                    const roleCfg =
                                        roleLabels[contact.role] ||
                                        roleLabels.pending;

                                    return (
                                        <button
                                            key={contact.id}
                                            onClick={() =>
                                                handleSelectContact(contact)
                                            }
                                            className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors ${
                                                isSelected
                                                    ? 'bg-purple-500/10'
                                                    : 'hover:bg-muted/40'
                                            }`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs ${getAvatarGradient(
                                                    contact.role,
                                                )}`}
                                            >
                                                {contact.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                {contact.role ===
                                                    'superadmin' && (
                                                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background">
                                                        <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span
                                                        className={`truncate text-xs font-semibold ${
                                                            isSelected
                                                                ? 'font-bold text-purple-400'
                                                                : 'text-foreground'
                                                        }`}
                                                    >
                                                        {contact.name}
                                                    </span>
                                                    {contact.last_message && (
                                                        <span className="shrink-0 text-[10px] text-muted-foreground">
                                                            {formatContactTime(
                                                                contact
                                                                    .last_message
                                                                    .created_at,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-1 flex items-center justify-between gap-1">
                                                    <p className="truncate text-[11px] text-muted-foreground">
                                                        {contact.last_message ? (
                                                            <>
                                                                {contact
                                                                    .last_message
                                                                    .sender_id ===
                                                                    auth.user
                                                                        .id && (
                                                                    <span className="text-foreground/70">
                                                                        Anda:{' '}
                                                                    </span>
                                                                )}
                                                                {contact
                                                                    .last_message
                                                                    .is_broadcast && (
                                                                    <span className="font-semibold text-purple-400">
                                                                        [Siaran]{' '}
                                                                    </span>
                                                                )}
                                                                {
                                                                    contact
                                                                        .last_message
                                                                        .message
                                                                }
                                                            </>
                                                        ) : (
                                                            <span className="italic opacity-60">
                                                                Mulai percakapan
                                                            </span>
                                                        )}
                                                    </p>

                                                    {/* Unread Badge */}
                                                    {contact.unread_count >
                                                        0 && (
                                                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-purple-500 px-1 text-[9px] font-bold text-white shadow-xs">
                                                            {
                                                                contact.unread_count
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Conversation Window (Right) */}
                    <div
                        className={`flex flex-1 flex-col ${
                            showMobileList ? 'hidden md:flex' : 'flex'
                        }`}
                    >
                        {activeUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between border-b border-sidebar-border/70 bg-muted/20 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {/* Mobile Back Button */}
                                        <button
                                            onClick={() =>
                                                setShowMobileList(true)
                                            }
                                            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>

                                        {/* Avatar */}
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarGradient(
                                                activeUser.role,
                                            )}`}
                                        >
                                            {activeUser.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-foreground">
                                                    {activeUser.name}
                                                </h3>
                                                <span
                                                    className={`py-0.2 inline-flex items-center rounded-full px-2 text-[10px] font-medium ring-1 ring-inset ${
                                                        roleLabels[
                                                            activeUser.role
                                                        ]?.class || ''
                                                    }`}
                                                >
                                                    {roleLabels[activeUser.role]
                                                        ?.text ||
                                                        activeUser.role}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">
                                                {activeUser.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Message History */}
                                <div className="flex-1 space-y-3 overflow-y-auto bg-muted/5 p-4">
                                    {messageList.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                                                <Sparkles className="h-6 w-6" />
                                            </div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Belum ada obrolan dengan{' '}
                                                {activeUser.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Kirim pesan pertama Anda untuk
                                                memulai percakapan.
                                            </p>
                                        </div>
                                    ) : (
                                        messageList.map((msg) => {
                                            const isMe =
                                                msg.sender_id === auth.user.id;

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex flex-col ${
                                                        isMe
                                                            ? 'items-end'
                                                            : 'items-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs transition-all sm:max-w-[70%] ${
                                                            isMe
                                                                ? 'rounded-br-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                                                : 'rounded-bl-xs border border-sidebar-border/70 bg-card text-foreground'
                                                        }`}
                                                    >
                                                        {/* Broadcast Banner */}
                                                        {msg.is_broadcast && (
                                                            <div
                                                                className={`mb-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                                                                    isMe
                                                                        ? 'bg-white/20 text-white'
                                                                        : 'bg-purple-500/10 text-purple-400'
                                                                }`}
                                                            >
                                                                <Megaphone className="h-3 w-3" />
                                                                Pesan Siaran
                                                                Superadmin
                                                            </div>
                                                        )}

                                                        {/* Message Body */}
                                                        <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                                                            {msg.message}
                                                        </p>

                                                        {/* Message Meta */}
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                                                                isMe
                                                                    ? 'text-white/70'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            <span>
                                                                {formatMessageTime(
                                                                    msg.created_at,
                                                                )}
                                                            </span>
                                                            {isMe && (
                                                                <span>
                                                                    {msg.read_at ? (
                                                                        <CheckCheck className="h-3 w-3 text-cyan-200" />
                                                                    ) : (
                                                                        <Check className="h-3 w-3 opacity-70" />
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input Box */}
                                <form
                                    onSubmit={handleSendMessage}
                                    className="border-t border-sidebar-border/70 bg-card p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) =>
                                                setInputMessage(e.target.value)
                                            }
                                            placeholder={`Tulis pesan ke ${activeUser.name}...`}
                                            className="flex-1 rounded-xl border border-sidebar-border/70 bg-background px-4 py-2.5 text-xs transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                !inputMessage.trim() ||
                                                isSending
                                            }
                                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white transition-all hover:bg-purple-600 active:scale-95 disabled:opacity-40"
                                            title="Kirim pesan"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-muted-foreground">
                                <MessageSquare className="mb-3 h-12 w-12 opacity-20" />
                                <h3 className="text-sm font-semibold text-foreground">
                                    Pilih Pengguna
                                </h3>
                                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                                    Pilih salah satu kontak di bilah kiri untuk
                                    membuka percakapan.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk Broadcast Modal (Superadmin Only) */}
                {showBulkModal && (
                    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200 fade-in">
                        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-sidebar-border bg-card shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <Megaphone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            Siaran Pesan Massal (Bulk Chat)
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Kirimkan pengumuman serentak ke
                                            semua anggota
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSendBulk}
                                className="space-y-4 p-6"
                            >
                                {bulkError && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400">
                                        {bulkError}
                                    </div>
                                )}

                                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 text-xs leading-relaxed text-purple-300">
                                    Pesan ini akan dikirimkan ke{' '}
                                    <strong className="text-white">
                                        {totalActiveUsersCount} pengguna aktif
                                    </strong>
                                    . Setiap pengguna akan menerimanya di
                                    obrolan pribadi mereka bersama Superadmin
                                    dengan tanda khusus{' '}
                                    <span className="font-bold underline">
                                        [Pesan Siaran]
                                    </span>
                                    .
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                                        Isi Pesan Siaran{' '}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={bulkMessage}
                                        onChange={(e) =>
                                            setBulkMessage(e.target.value)
                                        }
                                        rows={5}
                                        placeholder="Tuliskan pengumuman atau pesan yang ingin disampaikan ke seluruh pengguna..."
                                        required
                                        className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs leading-relaxed transition-colors focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                                    />
                                    <div className="mt-1 flex justify-end">
                                        <span className="text-[10px] text-muted-foreground">
                                            {bulkMessage.length} / 5000 karakter
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end gap-2.5 border-t border-sidebar-border/70 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkModal(false)}
                                        disabled={isSendingBulk}
                                        className="rounded-xl border border-sidebar-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            isSendingBulk || !bulkMessage.trim()
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-600 disabled:opacity-50"
                                    >
                                        <Megaphone className="h-3.5 w-3.5" />
                                        {isSendingBulk
                                            ? 'Mengirim...'
                                            : `Kirim ke Semua (${totalActiveUsersCount})`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
