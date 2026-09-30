import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    isStandalone,
    canPromptNativeInstall,
    promptNativeInstall,
    subscribeToInstallPrompt,
} from '@/lib/pwa';
import { PwaInstallDialog } from '@/components/pwa-install-dialog';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'dinasti_pwa_banner_dismissed_until';

export function PwaInstallBanner() {
    const [visible, setVisible] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // Do not show if already in standalone mode
        if (isStandalone()) {
            return;
        }

        // Check if recently dismissed
        const dismissedUntil = localStorage.getItem(DISMISS_KEY);
        if (dismissedUntil && parseInt(dismissedUntil, 10) > Date.now()) {
            return;
        }

        // Delay banner appearance slightly so it doesn't interrupt page load
        const timer = setTimeout(() => {
            if (!isStandalone()) {
                setVisible(true);
            }
        }, 2000);

        const unsubscribe = subscribeToInstallPrompt(() => {
            if (!isStandalone() && (!dismissedUntil || parseInt(dismissedUntil, 10) <= Date.now())) {
                setVisible(true);
            }
        });

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        // Dismiss for 7 days
        const sevenDays = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem(DISMISS_KEY, sevenDays.toString());
    };

    const handleInstallClick = async () => {
        if (canPromptNativeInstall()) {
            const outcome = await promptNativeInstall();
            if (outcome === 'accepted') {
                setVisible(false);
                return;
            }
        }
        // If native prompt is not directly available (e.g. Safari iOS/Mac), show detailed guide dialog
        setDialogOpen(true);
    };

    if (!visible) {
        return <PwaInstallDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
    }

    return (
        <>
            <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20">
                            <Download className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-zinc-100 truncate">
                                Pasang Aplikasi Dinasti Nasrukhan
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                                Instal di Chrome atau Safari untuk akses cepat
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                            size="sm"
                            onClick={handleInstallClick}
                            className="h-8 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold px-3 text-xs rounded-lg shadow-sm"
                        >
                            Instal
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleDismiss}
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg"
                            title="Tutup banner"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <PwaInstallDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    );
}
