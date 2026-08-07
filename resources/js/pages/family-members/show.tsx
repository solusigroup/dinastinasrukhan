import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Heart, Users, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember } from '@/types';

export default function FamilyMemberShow() {
    const { member } = usePage<{ member: FamilyMember }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Anggota Keluarga', href: '/family-members' },
        { title: member.name, href: '#' },
    ];

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={member.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/family-members"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
                            <p className="text-sm text-muted-foreground">Detail Anggota Keluarga</p>
                        </div>
                    </div>
                    <Link
                        href={`/family-members/${member.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-3xl">
                    {/* Profile Card */}
                    <div className="rounded-2xl border border-sidebar-border/70 p-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                            {/* Avatar */}
                            <div
                                className={`flex h-24 w-24 shrink-0 overflow-hidden items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-md ${
                                    member.photo ? 'bg-muted/30' : (member.gender === 'male'
                                        ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                                        : 'bg-gradient-to-br from-pink-500 to-rose-600')
                                }`}
                            >
                                {member.photo ? (
                                    <img 
                                        src={`/storage/${member.photo}`} 
                                        alt={member.name} 
                                        className="h-full w-full object-cover" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    member.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 space-y-4 text-center sm:text-left">
                                <div>
                                    <h2 className="text-xl font-bold">{member.name}</h2>
                                    <span
                                        className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                            member.gender === 'male'
                                                ? 'bg-sky-500/10 text-sky-400'
                                                : 'bg-pink-500/10 text-pink-400'
                                        }`}
                                    >
                                        {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'} · Generasi{' '}
                                        {member.generation}
                                    </span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {member.birth_place && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-amber-400" />
                                            {member.birth_place}
                                        </div>
                                    )}
                                    {member.birth_date && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-emerald-400" />
                                            Lahir: {formatDate(member.birth_date)}
                                        </div>
                                    )}
                                    {(member.is_deceased || member.death_date) && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-red-400" />
                                            Wafat{member.death_date ? `: ${formatDate(member.death_date)}` : ' (tanggal tidak diketahui)'}
                                        </div>
                                    )}
                                    {member.spouses && member.spouses.length > 0 && (
                                        <div className="col-span-1 border-t border-sidebar-border/50 pt-3 sm:col-span-2">
                                            <p className="mb-3 text-sm font-semibold text-foreground">Pasangan</p>
                                            <div className="flex flex-col gap-4">
                                                {member.spouses.map(spouse => (
                                                    <div key={spouse.id} className="flex items-center gap-3 rounded-lg border border-sidebar-border/50 bg-muted/10 p-3">
                                                        <div className={`flex h-12 w-12 shrink-0 overflow-hidden items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${spouse.photo ? 'bg-muted/30' : (spouse.gender === 'male' ? 'bg-gradient-to-br from-sky-500 to-blue-600' : 'bg-gradient-to-br from-pink-500 to-rose-600')}`}>
                                                            {spouse.photo ? (
                                                                <img src={`/storage/${spouse.photo}`} alt={spouse.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                            ) : (
                                                                spouse.name.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-foreground">{spouse.name}</span>
                                                                {spouse.status === 'divorced' ? (
                                                                    <span className="rounded bg-slate-500/20 px-2 py-0.5 text-[10px] font-medium text-slate-400">Cerai</span>
                                                                ) : (
                                                                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Masih Menikah</span>
                                                                )}
                                                            </div>
                                                            <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Heart className="h-3 w-3 text-pink-400" /> {spouse.gender === 'male' ? 'Suami' : 'Istri'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                            <div className="mt-6 rounded-xl border border-sidebar-border/50 bg-muted/20 p-5">
                                <h3 className="mb-2 text-sm font-semibold text-foreground">Biografi</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                            </div>
                        )}

                        {/* Parent */}
                        {member.parent && (
                            <div className="mt-6">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Users className="h-4 w-4 text-amber-400" />
                                    Orang Tua
                                </h3>
                                <Link
                                    href={`/family-members/${member.parent.id}`}
                                    className="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/50 px-4 py-2 text-sm transition-colors hover:bg-muted"
                                >
                                    <span className="font-medium">
                                        {member.parent.name} 
                                        {member.parentSpouse && ` & ${member.parentSpouse.name}`}
                                    </span>
                                </Link>
                            </div>
                        )}

                        {/* Children */}
                        {member.children && member.children.length > 0 && (
                            <div className="mt-6">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Users className="h-4 w-4 text-emerald-400" />
                                    Anak-anak ({member.children.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {member.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/family-members/${child.id}`}
                                            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted ${
                                                child.gender === 'male'
                                                    ? 'border-sky-500/20'
                                                    : 'border-pink-500/20'
                                            }`}
                                        >
                                            <span className="font-medium">{child.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
