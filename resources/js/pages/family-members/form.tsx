import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FamilyMember, Spouse } from '@/types';

type ParentOption = {
    id: number;
    name: string;
    gender: 'male' | 'female';
    generation: number;
    spouses?: Spouse[];
};

type FormProps = {
    member?: FamilyMember;
    parents: ParentOption[];
};

export default function FamilyMemberForm() {
    const { member, parents } = usePage<FormProps>().props;
    const isEditing = !!member;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Anggota Keluarga', href: '/family-members' },
        { title: isEditing ? 'Edit' : 'Tambah Baru', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: member?.name ?? '',
        gender: member?.gender ?? 'male',
        birth_date: member?.birth_date?.split('T')[0] ?? '',
        death_date: member?.death_date?.split('T')[0] ?? '',
        is_deceased: member?.is_deceased ?? false,
        birth_place: member?.birth_place ?? '',
        bio: member?.bio ?? '',
        parent_id: member?.parent_id?.toString() ?? '',
        parent_spouse_id: member?.parent_spouse_id?.toString() ?? '',
        spouses: member?.spouses?.map(s => ({
            id: s.id,
            name: s.name,
            gender: s.gender,
            birth_date: s.birth_date?.split('T')[0] ?? '',
            death_date: s.death_date?.split('T')[0] ?? '',
            status: s.status ?? 'married',
            photo: s.photo ?? null as any,
        })) ?? [],
        photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            post(`/family-members/${member!.id}?_method=PUT`, {
                forceFormData: true,
            });
        } else {
            post('/family-members', {
                forceFormData: true,
            });
        }
    };

    const addSpouse = () => {
        setData('spouses', [
            ...data.spouses,
            { name: '', gender: data.gender === 'male' ? 'female' : 'male', birth_date: '', death_date: '', status: 'married', photo: null } as any
        ]);
    };

    const removeSpouse = (index: number) => {
        const newSpouses = [...data.spouses];
        newSpouses.splice(index, 1);
        setData('spouses', newSpouses);
    };

    const updateSpouse = (index: number, field: string, value: any) => {
        const newSpouses = [...data.spouses];
        newSpouses[index] = { ...newSpouses[index], [field]: value };
        setData('spouses', newSpouses);
    };

    const selectedParent = parents.find(p => p.id.toString() === data.parent_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${member!.name}` : 'Tambah Anggota'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/family-members"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isEditing ? `Edit: ${member!.name}` : 'Tambah Anggota Baru'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isEditing ? 'Perbarui data anggota keluarga' : 'Daftarkan anggota keluarga baru'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 space-y-5">
                        <h2 className="text-lg font-bold border-b border-sidebar-border/70 pb-2 mb-4">Biodata Diri</h2>
                        
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                                Nama Lengkap Diri Sendiri <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Jenis Kelamin Diri Sendiri <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${data.gender === 'male' ? 'border-sky-500/50 bg-sky-500/10 text-sky-400' : 'border-sidebar-border/70'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={data.gender === 'male'}
                                        onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                                        className="hidden"
                                    />
                                    Laki-laki
                                </label>
                                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${data.gender === 'female' ? 'border-pink-500/50 bg-pink-500/10 text-pink-400' : 'border-sidebar-border/70'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={data.gender === 'female'}
                                        onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                                        className="hidden"
                                    />
                                    Perempuan
                                </label>
                            </div>
                            {errors.gender && <p className="mt-1 text-xs text-red-400">{errors.gender}</p>}
                        </div>

                        {/* Birth Date & Place */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="birth_date" className="mb-1.5 block text-sm font-medium">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                />
                                {errors.birth_date && <p className="mt-1 text-xs text-red-400">{errors.birth_date}</p>}
                            </div>
                            <div>
                                <label htmlFor="birth_place" className="mb-1.5 block text-sm font-medium">
                                    Tempat Lahir
                                </label>
                                <input
                                    id="birth_place"
                                    type="text"
                                    value={data.birth_place}
                                    onChange={(e) => setData('birth_place', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                    placeholder="Masukkan tempat lahir"
                                />
                                {errors.birth_place && <p className="mt-1 text-xs text-red-400">{errors.birth_place}</p>}
                            </div>
                        </div>

                        {/* Deceased Status */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Sudah Wafat?
                            </label>
                            <div className="flex gap-4">
                                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${!data.is_deceased ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' : 'border-sidebar-border/70'}`}>
                                    <input
                                        type="radio"
                                        name="is_deceased"
                                        checked={!data.is_deceased}
                                        onChange={() => { setData(prev => ({ ...prev, is_deceased: false, death_date: '' })); }}
                                        className="hidden"
                                    />
                                    Tidak (Masih Hidup)
                                </label>
                                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${data.is_deceased ? 'border-slate-500/50 bg-slate-500/10 text-slate-400' : 'border-sidebar-border/70'}`}>
                                    <input
                                        type="radio"
                                        name="is_deceased"
                                        checked={data.is_deceased}
                                        onChange={() => setData(prev => ({ ...prev, is_deceased: true }))}
                                        className="hidden"
                                    />
                                    Ya (Sudah Wafat)
                                </label>
                            </div>
                            {errors.is_deceased && <p className="mt-1 text-xs text-red-400">{errors.is_deceased}</p>}
                        </div>

                        {/* Death Date - only shown when is_deceased is true */}
                        {data.is_deceased && (
                            <div>
                                <label htmlFor="death_date" className="mb-1.5 block text-sm font-medium">
                                    Tanggal Wafat <span className="text-xs text-muted-foreground">(Opsional, kosongkan jika tidak diketahui)</span>
                                </label>
                                <input
                                    id="death_date"
                                    type="date"
                                    value={data.death_date}
                                    onChange={(e) => setData('death_date', e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                />
                                {errors.death_date && <p className="mt-1 text-xs text-red-400">{errors.death_date}</p>}
                            </div>
                        )}

                        {/* Parent */}
                        <div className="pt-2">
                            <h3 className="text-md font-bold mb-2">Relasi Orang Tua</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="parent_id" className="mb-1.5 block text-sm font-medium">
                                        Pilih Orang Tua Nasab/Silsilah
                                    </label>
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        <option value="">-- Tidak ada (Generasi Pertama) --</option>
                                        {parents.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Gen {p.generation})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.parent_id && <p className="mt-1 text-xs text-red-400">{errors.parent_id}</p>}
                                </div>

                                {selectedParent && selectedParent.spouses && selectedParent.spouses.length > 0 && (
                                    <div>
                                        <label htmlFor="parent_spouse_id" className="mb-1.5 block text-sm font-medium text-amber-500">
                                            Lahir dari Pasangan yang mana?
                                        </label>
                                        <select
                                            id="parent_spouse_id"
                                            value={data.parent_spouse_id}
                                            onChange={(e) => setData('parent_spouse_id', e.target.value)}
                                            className="w-full rounded-lg border border-amber-500/50 bg-background px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        >
                                            <option value="">-- Pilih Pasangan dari {selectedParent.name} --</option>
                                            {selectedParent.spouses.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.parent_spouse_id && <p className="mt-1 text-xs text-red-400">{errors.parent_spouse_id}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Spouses Area */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-2 mb-4">
                            <h2 className="text-lg font-bold">Daftar Pasangan</h2>
                            <button
                                type="button"
                                onClick={addSpouse}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-500 hover:bg-emerald-500/20"
                            >
                                <Plus className="h-4 w-4" /> Tambah Pasangan
                            </button>
                        </div>

                        {data.spouses.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground py-4">Belum ada data pasangan. Klik tombol Tambah Pasangan jika perlu.</p>
                        ) : (
                            <div className="space-y-6">
                                {data.spouses.map((spouse, index) => (
                                    <div key={index} className="relative rounded-lg border border-sidebar-border/50 bg-muted/20 p-4 space-y-4">
                                        <button
                                            type="button"
                                            onClick={() => removeSpouse(index)}
                                            className="absolute right-3 top-3 text-red-400 hover:text-red-500"
                                            title="Hapus Pasangan"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        
                                        <h3 className="text-sm font-bold text-muted-foreground mb-2">Pasangan #{index + 1}</h3>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* Name */}
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium">Nama Pasangan <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    value={spouse.name}
                                                    onChange={(e) => updateSpouse(index, 'name', e.target.value)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm"
                                                    required
                                                />
                                                {/* Error mapping for arrays */}
                                                {(errors as any)[`spouses.${index}.name`] && <p className="mt-1 text-xs text-red-400">{(errors as any)[`spouses.${index}.name`]}</p>}
                                            </div>

                                            {/* Gender */}
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium">Jenis Kelamin <span className="text-red-400">*</span></label>
                                                <select
                                                    value={spouse.gender}
                                                    onChange={(e) => updateSpouse(index, 'gender', e.target.value)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm"
                                                >
                                                    <option value="female">Perempuan</option>
                                                    <option value="male">Laki-laki</option>
                                                </select>
                                                {(errors as any)[`spouses.${index}.gender`] && <p className="mt-1 text-xs text-red-400">{(errors as any)[`spouses.${index}.gender`]}</p>}
                                            </div>

                                            {/* Marital Status */}
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium">Status Pernikahan Saat Ini</label>
                                                <select
                                                    value={spouse.status ?? 'married'}
                                                    onChange={(e) => updateSpouse(index, 'status', e.target.value)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm"
                                                >
                                                    <option value="married">Masih Menikah</option>
                                                    <option value="divorced">Cerai</option>
                                                </select>
                                                {(errors as any)[`spouses.${index}.status`] && <p className="mt-1 text-xs text-red-400">{(errors as any)[`spouses.${index}.status`]}</p>}
                                            </div>

                                            {/* Birth Date */}
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium">Tanggal Lahir</label>
                                                <input
                                                    type="date"
                                                    value={spouse.birth_date}
                                                    onChange={(e) => updateSpouse(index, 'birth_date', e.target.value)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm"
                                                />
                                            </div>

                                            {/* Death Date */}
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium">Tanggal Wafat</label>
                                                <input
                                                    type="date"
                                                    value={spouse.death_date}
                                                    onChange={(e) => updateSpouse(index, 'death_date', e.target.value)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm"
                                                />
                                            </div>
                                            
                                            {/* Photo */}
                                            <div className="md:col-span-2">
                                                <label className="mb-1.5 block text-sm font-medium">Foto Pasangan (Opsional)</label>
                                                {spouse.photo && typeof spouse.photo === 'string' && (
                                                    <div className="mb-2 h-12 w-12 overflow-hidden rounded-full border border-sidebar-border/70">
                                                        <img src={`/storage/${spouse.photo}`} alt={spouse.name} className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => updateSpouse(index, 'photo', e.target.files?.[0] ?? null)}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500/10 file:px-4 file:py-1 file:text-sm file:font-medium file:text-pink-400 transition-colors focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                                />
                                                {(errors as any)[`spouses.${index}.photo`] && <p className="mt-1 text-xs text-red-400">{(errors as any)[`spouses.${index}.photo`]}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 space-y-5">
                        <h2 className="text-lg font-bold border-b border-sidebar-border/70 pb-2 mb-4">Informasi Tambahan</h2>
                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="mb-1.5 block text-sm font-medium">
                                Biografi Diri
                            </label>
                            <textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                placeholder="Ceritakan tentang profil anggota keluarga ini..."
                            />
                            {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio}</p>}
                        </div>

                        {/* Photo */}
                        <div>
                            <label htmlFor="photo" className="mb-1.5 block text-sm font-medium">
                                Foto Diri
                            </label>
                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                                className="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500/10 file:px-4 file:py-1 file:text-sm file:font-medium file:text-amber-400 transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />
                            {errors.photo && <p className="mt-1 text-xs text-red-400">{errors.photo}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href="/family-members"
                            className="rounded-xl border border-sidebar-border/70 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : isEditing ? 'Perbarui' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
