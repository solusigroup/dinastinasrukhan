import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Image as ImageIcon, Users } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Galeri Keluarga', href: '/gallery' },
];

export default function Gallery() {
    const { members } = usePage<{ members: FamilyMember[] }>().props;
    const [search, setSearch] = useState('');

    const filteredMembers = members.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.spouses?.some(s => s.name.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Galeri Keluarga" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Galeri Keluarga</h1>
                        <p className="text-sm text-muted-foreground">
                            Foto anggota keluarga dan pasangannya
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama anggota atau nama pasangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pl-10 pr-4 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>

                {/* Gallery Grid */}
                {filteredMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <ImageIcon className="mb-4 h-12 w-12 opacity-20" />
                        <p>Tidak ada foto yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card transition-all hover:shadow-lg hover:shadow-amber-500/10"
                            >
                                {/* Main Member Photo */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
                                    {member.photo ? (
                                        <img
                                            src={`/storage/${member.photo}`}
                                            alt={member.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center ${member.photo ? 'hidden' : ''} ${member.gender === 'male' ? 'bg-sky-500/10 text-sky-500' : 'bg-pink-500/10 text-pink-500'}`}>
                                        <Users className="h-12 w-12 opacity-30" />
                                    </div>
                                    
                                    {/* Action Link Overlay */}
                                    <Link 
                                        href={`/family-members/${member.id}`}
                                        className="absolute inset-0 z-10"
                                    >
                                        <span className="sr-only">Lihat detail {member.name}</span>
                                    </Link>
                                </div>

                                {/* Member Info */}
                                <div className="relative z-20 flex flex-1 flex-col p-4">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-foreground line-clamp-1">{member.name}</h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                member.gender === 'male' ? 'bg-sky-500/10 text-sky-400' : 'bg-pink-500/10 text-pink-400'
                                            }`}>
                                                {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                                Gen {member.generation}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Spouses List */}
                                    <div className="mt-auto border-t border-sidebar-border/50 pt-3">
                                        <p className="mb-2 text-xs font-medium text-muted-foreground">Pasangan:</p>
                                        {member.spouses && member.spouses.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {member.spouses.map((spouse) => (
                                                    <div key={spouse.id} className="flex items-center gap-2">
                                                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/50 text-xs font-bold text-white">
                                                            {spouse.photo ? (
                                                                <img
                                                                    src={`/storage/${spouse.photo}`}
                                                                    alt={spouse.name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className={`absolute inset-0 flex items-center justify-center ${spouse.photo ? 'hidden' : ''} bg-sidebar-border/50`}>
                                                                {spouse.name.charAt(0)}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-foreground line-clamp-1 flex items-center gap-1">
                                                            <span>{spouse.name}</span>
                                                            {spouse.status === 'divorced' && (
                                                                <span className="rounded bg-slate-500/20 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">Cerai</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground/50 italic">- Belum ada pasangan -</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
