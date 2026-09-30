import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    isIOS,
    isSafari,
    isStandalone,
    canPromptNativeInstall,
    promptNativeInstall,
    subscribeToInstallPrompt,
} from '@/lib/pwa';
import {
    Download,
    Share,
    PlusSquare,
    CheckCircle2,
    Laptop,
    Smartphone,
    ExternalLink,
    Sparkles,
} from 'lucide-react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PwaInstallDialog({ open, onOpenChange }: Props) {
    const [installed, setInstalled] = useState(false);
    const [canNativePrompt, setCanNativePrompt] = useState(false);
    const [ios, setIos] = useState(false);
    const [safari, setSafari] = useState(false);

    useEffect(() => {
        setInstalled(isStandalone());
        setCanNativePrompt(canPromptNativeInstall());
        setIos(isIOS());
        setSafari(isSafari());

        const unsubscribe = subscribeToInstallPrompt(() => {
            setCanNativePrompt(canPromptNativeInstall());
            setInstalled(isStandalone());
        });

        return unsubscribe;
    }, []);

    const handleNativeInstall = async () => {
        const result = await promptNativeInstall();
        if (result === 'accepted') {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-amber-500/30 bg-zinc-950 text-zinc-100 sm:max-w-lg">
                <DialogHeader className="text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
                            <Download className="h-6 w-6 text-zinc-950" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-amber-400">
                                Instal Dinasti Nasrukhan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400">
                                Akses cepat, layar penuh, dan pengalaman seperti aplikasi native.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {installed ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                        <h4 className="font-semibold text-emerald-300">Aplikasi Sudah Terinstal</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                            Anda sudah menjalankan Dinasti Nasrukhan dalam mode aplikasi mandiri (PWA).
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Native Install Button (Chrome / Edge / Android) */}
                        {canNativePrompt && (
                            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
                                <div className="flex items-center gap-2 font-medium text-amber-300 text-sm mb-1.5">
                                    <Sparkles className="h-4 w-4 text-amber-400" />
                                    Instal Otomatis Sekali Klik
                                </div>
                                <p className="text-xs text-zinc-400 mb-3">
                                    Browser Anda mendukung instalasi langsung ke perangkat tanpa melalui Play Store / App Store.
                                </p>
                                <Button
                                    onClick={handleNativeInstall}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-zinc-950 font-semibold"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Instal Sekarang
                                </Button>
                            </div>
                        )}

                        {/* iOS Safari Instructions */}
                        {ios && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                                    <Smartphone className="h-4 w-4 text-amber-400" />
                                    Cara Instal di Safari (iPhone / iPad):
                                </div>
                                <ol className="space-y-2.5 text-xs text-zinc-300">
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">1</span>
                                        <span>
                                            Ketuk tombol <strong>Bagikan (Share)</strong> <Share className="inline h-3.5 w-3.5 mx-1 text-sky-400" /> di bilah navigasi bawah Safari.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">2</span>
                                        <span>
                                            Gulir ke bawah dan pilih opsi <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong> <PlusSquare className="inline h-3.5 w-3.5 mx-1 text-amber-400" />.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">3</span>
                                        <span>
                                            Ketuk <strong>"Tambah" (Add)</strong> di pojok kanan atas. Ikon Dinasti Nasrukhan akan muncul di layar utama Anda.
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        )}

                        {/* macOS Safari Instructions */}
                        {!ios && safari && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                                    <Laptop className="h-4 w-4 text-amber-400" />
                                    Cara Instal di Safari (Mac):
                                </div>
                                <ol className="space-y-2.5 text-xs text-zinc-300">
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">1</span>
                                        <span>
                                            Klik menu <strong>File</strong> di bilah menu Safari atas (atau klik tombol Bagikan).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">2</span>
                                        <span>
                                            Pilih <strong>"Tambahkan ke Dock..." (Add to Dock...)</strong>.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">3</span>
                                        <span>
                                            Klik <strong>Tambah</strong> untuk menyimpan Dinasti Nasrukhan sebagai aplikasi di Dock Anda.
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        )}

                        {/* Chrome / Desktop Generic Instructions (fallback if not auto-prompted) */}
                        {!canNativePrompt && !ios && !safari && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                                    <Laptop className="h-4 w-4 text-amber-400" />
                                    Cara Instal di Chrome / Edge:
                                </div>
                                <ol className="space-y-2.5 text-xs text-zinc-300">
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">1</span>
                                        <span>
                                            Klik ikon <strong>Instal</strong> <ExternalLink className="inline h-3.5 w-3.5 mx-1 text-amber-400" /> yang berada di sisi kanan bilah alamat (address bar) Chrome.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">2</span>
                                        <span>
                                            Atau klik menu titik tiga (<strong>⋮</strong>) &rarr; pilih <strong>"Simpan dan Bagikan" (Save and share)</strong> &rarr; <strong>"Instal Dinasti Nasrukhan"</strong>.
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        )}

                        {/* Benefits list */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                            <div className="rounded-lg bg-zinc-900/50 p-2.5 border border-zinc-800/80">
                                <span className="font-semibold text-zinc-200 block mb-0.5">⚡ Ringan & Cepat</span>
                                Membuka aplikasi secara instan tanpa perlu mengetik URL lagi.
                            </div>
                            <div className="rounded-lg bg-zinc-900/50 p-2.5 border border-zinc-800/80">
                                <span className="font-semibold text-zinc-200 block mb-0.5">📱 Tampilan Penuh</span>
                                Navigasi bersih tanpa bilah tab browser yang mengganggu.
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
