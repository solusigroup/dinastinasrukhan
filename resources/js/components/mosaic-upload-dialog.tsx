import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    X,
    UploadCloud,
    Image as ImageIcon,
    Calendar,
    Users,
    Tag,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { compressImage } from '@/lib/image-compressor';
import type { FamilyMosaic } from '@/types';

interface MemberOption {
    id: number;
    name: string;
    generation: number;
}

interface MosaicUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    uploadableMembers: MemberOption[];
    allMembers: MemberOption[];
    editingMosaic?: FamilyMosaic | null;
}

export function MosaicUploadDialog({
    isOpen,
    onClose,
    uploadableMembers,
    allMembers,
    editingMosaic,
}: MosaicUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<{
        originalSize: string;
        compressedSize: string;
        savingsPercent: number;
    } | null>(null);

    const [familyMemberId, setFamilyMemberId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [activityDate, setActivityDate] = useState('');
    const [taggedMemberIds, setTaggedMemberIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize or reset form when dialog opens or editingMosaic changes
    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setPreviewUrl(null);
            setCompressionInfo(null);
            setErrors({});
            return;
        }

        if (editingMosaic) {
            setFamilyMemberId(String(editingMosaic.family_member_id));
            setTitle(editingMosaic.title || '');
            setCaption(editingMosaic.caption || '');
            setActivityDate(
                editingMosaic.activity_date
                    ? editingMosaic.activity_date.split('T')[0]
                    : '',
            );
            setTaggedMemberIds(
                editingMosaic.tagged_members?.map((m) => m.id) || [],
            );
            setPreviewUrl(`/storage/${editingMosaic.photo_path}`);
            setCompressionInfo(null);
        } else {
            setFamilyMemberId(uploadableMembers[0]?.id ? String(uploadableMembers[0].id) : '');
            setTitle('');
            setCaption('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setTaggedMemberIds([]);
            setPreviewUrl(null);
            setCompressionInfo(null);
        }
        setErrors({});
    }, [isOpen, editingMosaic, uploadableMembers]);

    if (!isOpen) return null;

    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setIsCompressing(true);
        const originalBytes = selectedFile.size;

        try {
            // Compress image client-side first before upload
            const compressed = await compressImage(selectedFile, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.85,
            });

            const compressedBytes = compressed.size;
            const savings = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));

            setFile(compressed);
            setCompressionInfo({
                originalSize: formatBytes(originalBytes),
                compressedSize: formatBytes(compressedBytes),
                savingsPercent: savings,
            });

            const url = URL.createObjectURL(compressed);
            setPreviewUrl(url);
        } catch (err) {
            console.error('Failed to compress image:', err);
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } finally {
            setIsCompressing(false);
        }
    };

    const handleTaggedMemberToggle = (id: number) => {
        setTaggedMemberIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!editingMosaic && !file) {
            setErrors({ photo: 'Silakan pilih foto terlebih dahulu.' });
            return;
        }

        if (!familyMemberId) {
            setErrors({ family_member_id: 'Pilih anggota keluarga / cabang silsilah terkait.' });
            return;
        }

        if (!caption.trim()) {
            setErrors({ caption: 'Keterangan atau caption foto wajib diisi.' });
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        if (file) {
            formData.append('photo', file);
        }
        formData.append('family_member_id', familyMemberId);
        if (title) formData.append('title', title);
        formData.append('caption', caption);
        if (activityDate) formData.append('activity_date', activityDate);

        taggedMemberIds.forEach((id) => {
            formData.append('tagged_member_ids[]', String(id));
        });

        if (editingMosaic) {
            formData.append('_method', 'PUT');
            router.post(`/mosaic/${editingMosaic.id}`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        } else {
            router.post('/mosaic', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in-0 duration-200">
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-sidebar-border/70 bg-card text-card-foreground shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-sidebar-border/70 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            {editingMosaic ? 'Edit Foto Mozaik' : 'Pasang Foto Mozaik Keluarga'}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {editingMosaic
                                ? 'Perbarui keterangan atau ganti foto kenangan'
                                : 'Unggah foto kegiatan/keluarga yang terhubung dengan silsilah'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Photo Uploader */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Foto Kegiatan / Keluarga <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {previewUrl ? (
                            <div className="space-y-2">
                                <div className="relative aspect-video max-h-56 w-full overflow-hidden rounded-xl border border-sidebar-border bg-black/5 flex items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/90 transition-colors"
                                    >
                                        Ganti Foto
                                    </button>
                                </div>

                                {/* Compression Notice */}
                                {compressionInfo && (
                                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>
                                            Foto dikompres otomatis:{' '}
                                            <strong>{compressionInfo.originalSize}</strong> ➔{' '}
                                            <strong>{compressionInfo.compressedSize}</strong>{' '}
                                            (Hemat {compressionInfo.savingsPercent}%)
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sidebar-border/80 bg-muted/20 p-6 text-center cursor-pointer hover:border-amber-500/50 hover:bg-muted/40 transition-colors"
                            >
                                {isCompressing ? (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                                        <p className="text-xs">Mengompresi foto...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-2">
                                            <UploadCloud className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Klik atau geser foto ke sini
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            JPG, PNG, atau WebP (otomatis dikompresi sebelum diunggah)
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        {errors.photo && (
                            <p className="mt-1 text-xs text-red-500">{errors.photo}</p>
                        )}
                    </div>

                    {/* Linked Tree Member Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Kaitkan dengan Anggota Silsilah <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={familyMemberId}
                            onChange={(e) => setFamilyMemberId(e.target.value)}
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        >
                            <option value="">-- Pilih Anggota Keluarga / Cabang --</option>
                            {uploadableMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} (Generasi {member.generation})
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Sebagai Editor, Anda hanya dapat mengaitkan foto dengan anggota keluarga di bawah cabang wewenang Anda.
                        </p>
                        {errors.family_member_id && (
                            <p className="mt-1 text-xs text-red-500">{errors.family_member_id}</p>
                        )}
                    </div>

                    {/* Title & Date */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                Judul Kegiatan / Momen (Opsional)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Reuni Akbar Bani Nasrukhan"
                                className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                Tanggal Kegiatan (Opsional)
                            </label>
                            <input
                                type="date"
                                value={activityDate}
                                onChange={(e) => setActivityDate(e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Caption / Story */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Keterangan / Caption Foto <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Ceritakan momen dalam foto ini, tempat kegiatan, siapa saja yang hadir, dsb..."
                            className="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none resize-y"
                        />
                        {errors.caption && (
                            <p className="mt-1 text-xs text-red-500">{errors.caption}</p>
                        )}
                    </div>

                    {/* Tag Additional Members */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Tandai Anggota Keluarga Lain (Opsional)
                        </label>
                        <div className="max-h-36 overflow-y-auto rounded-xl border border-sidebar-border/70 bg-muted/20 p-2.5 space-y-1">
                            {allMembers.slice(0, 50).map((member) => {
                                const isChecked = taggedMemberIds.includes(member.id);
                                return (
                                    <label
                                        key={member.id}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-muted cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleTaggedMemberToggle(member.id)}
                                            className="rounded border-sidebar-border text-amber-500 focus:ring-amber-500"
                                        />
                                        <span className="text-foreground">{member.name}</span>
                                        <span className="text-muted-foreground text-[10px]">
                                            (Gen {member.generation})
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-sidebar-border/70 px-6 py-4 bg-muted/20">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-sidebar-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isCompressing}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <span>{editingMosaic ? 'Simpan Perubahan' : 'Posting Foto Mozaik'}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
