<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    /**
     * Display the chat interface.
     */
    public function index(Request $request): Response
    {
        $currentUserId = auth()->id();

        // Get all active users except the current user
        $users = User::where('status', User::STATUS_ACTIVE)
            ->where('id', '!=', $currentUserId)
            ->get();

        // Get contacts with their last message and unread count
        $contacts = $users->map(function ($user) use ($currentUserId) {
            $lastMessage = ChatMessage::where(function ($q) use ($currentUserId, $user) {
                $q->where('sender_id', $currentUserId)->where('recipient_id', $user->id);
            })->orWhere(function ($q) use ($currentUserId, $user) {
                $q->where('sender_id', $user->id)->where('recipient_id', $currentUserId);
            })
            ->latest()
            ->first();

            $unreadCount = ChatMessage::where('sender_id', $user->id)
                ->where('recipient_id', $currentUserId)
                ->whereNull('read_at')
                ->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'unread_count' => $unreadCount,
                'last_message' => $lastMessage ? [
                    'id' => $lastMessage->id,
                    'message' => $lastMessage->message,
                    'is_broadcast' => $lastMessage->is_broadcast,
                    'sender_id' => $lastMessage->sender_id,
                    'created_at' => $lastMessage->created_at->toISOString(),
                ] : null,
            ];
        });

        // Sort: contacts with active messages first (newest first), then alphabetical
        $sortedContacts = $contacts->sort(function ($a, $b) {
            $timeA = $a['last_message']['created_at'] ?? null;
            $timeB = $b['last_message']['created_at'] ?? null;

            if ($timeA && $timeB) {
                return strcmp($timeB, $timeA);
            }
            if ($timeA) return -1;
            if ($timeB) return 1;

            return strcasecmp($a['name'], $b['name']);
        })->values();

        // Determine selected user
        $selectedUserId = $request->query('user_id');
        $selectedUser = null;

        if ($selectedUserId) {
            $selectedUser = $sortedContacts->firstWhere('id', (int) $selectedUserId);
        }

        if (!$selectedUser && $sortedContacts->isNotEmpty()) {
            $selectedUser = $sortedContacts->first();
        }

        $messages = [];
        if ($selectedUser) {
            // Mark unread messages from this user as read
            ChatMessage::where('sender_id', $selectedUser['id'])
                ->where('recipient_id', $currentUserId)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            // Update unread count for current contact in list
            $sortedContacts = $sortedContacts->map(function ($c) use ($selectedUser) {
                if ($c['id'] === $selectedUser['id']) {
                    $c['unread_count'] = 0;
                }
                return $c;
            });

            // Fetch conversation messages
            $messages = ChatMessage::where(function ($q) use ($currentUserId, $selectedUser) {
                $q->where('sender_id', $currentUserId)->where('recipient_id', $selectedUser['id']);
            })->orWhere(function ($q) use ($currentUserId, $selectedUser) {
                $q->where('sender_id', $selectedUser['id'])->where('recipient_id', $currentUserId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'sender_id' => $msg->sender_id,
                    'recipient_id' => $msg->recipient_id,
                    'message' => $msg->message,
                    'is_broadcast' => (bool) $msg->is_broadcast,
                    'read_at' => $msg->read_at ? $msg->read_at->toISOString() : null,
                    'created_at' => $msg->created_at->toISOString(),
                ];
            });
        }

        return Inertia::render('chat/index', [
            'contacts' => $sortedContacts,
            'selectedUser' => $selectedUser,
            'messages' => $messages,
            'totalActiveUsersCount' => $users->count(),
        ]);
    }

    /**
     * Get messages between authenticated user and target user (JSON for polling).
     */
    public function getMessages(User $user): JsonResponse
    {
        $currentUserId = auth()->id();

        // Mark incoming messages as read
        ChatMessage::where('sender_id', $user->id)
            ->where('recipient_id', $currentUserId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = ChatMessage::where(function ($q) use ($currentUserId, $user) {
            $q->where('sender_id', $currentUserId)->where('recipient_id', $user->id);
        })->orWhere(function ($q) use ($currentUserId, $user) {
            $q->where('sender_id', $user->id)->where('recipient_id', $currentUserId);
        })
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($msg) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'recipient_id' => $msg->recipient_id,
                'message' => $msg->message,
                'is_broadcast' => (bool) $msg->is_broadcast,
                'read_at' => $msg->read_at ? $msg->read_at->toISOString() : null,
                'created_at' => $msg->created_at->toISOString(),
            ];
        });

        return response()->json([
            'messages' => $messages,
        ]);
    }

    /**
     * Send a direct message to a user.
     */
    public function store(Request $request, User $user): RedirectResponse|JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ], [
            'message.required' => 'Pesan tidak boleh kosong.',
            'message.max' => 'Pesan maksimal 5000 karakter.',
        ]);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat mengirim pesan ke diri sendiri.');
        }

        if ($user->status !== User::STATUS_ACTIVE) {
            return back()->with('error', 'Pengguna tidak aktif.');
        }

        $message = ChatMessage::create([
            'sender_id' => auth()->id(),
            'recipient_id' => $user->id,
            'message' => trim($request->message),
            'is_broadcast' => false,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'recipient_id' => $message->recipient_id,
                    'message' => $message->message,
                    'is_broadcast' => false,
                    'read_at' => null,
                    'created_at' => $message->created_at->toISOString(),
                ],
            ]);
        }

        return redirect()->route('chat.index', ['user_id' => $user->id]);
    }

    /**
     * Send bulk chat / broadcast to all active users (Superadmin only).
     */
    public function bulkBroadcast(Request $request): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = auth()->user();

        if (!$currentUser->isSuperadmin()) {
            abort(403, 'Hanya Superadmin yang memiliki izin untuk mengirim pesan massal.');
        }

        $request->validate([
            'message' => 'required|string|max:5000',
        ], [
            'message.required' => 'Isi pesan massal wajib diisi.',
            'message.max' => 'Pesan massal maksimal 5000 karakter.',
        ]);

        $recipients = User::where('status', User::STATUS_ACTIVE)
            ->where('id', '!=', $currentUser->id)
            ->get();

        if ($recipients->isEmpty()) {
            return back()->with('error', 'Tidak ada pengguna aktif lain untuk menerima pesan massal.');
        }

        $now = now();
        $records = [];

        foreach ($recipients as $recipient) {
            $records[] = [
                'sender_id' => $currentUser->id,
                'recipient_id' => $recipient->id,
                'message' => trim($request->message),
                'is_broadcast' => true,
                'read_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        ChatMessage::insert($records);

        return back()->with('success', "Pesan massal berhasil dikirimkan ke {$recipients->count()} pengguna.");
    }
}
