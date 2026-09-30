/**
 * PWA Service Worker Registration & Install Prompt Helpers
 */

let deferredPrompt: any = null;
const installListeners = new Set<() => void>();

export function isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
    );
}

export function isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
}

export function isSafari(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /safari/.test(ua) && !/chrome|chromium|edg|opr|crios|fxios/.test(ua);
}

export function isChrome(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /chrome|chromium|crios/.test(ua) && !/edg|opr/.test(ua);
}

export function registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    // Capture beforeinstallprompt for Chrome, Edge, and Android
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        notifyInstallListeners();
    });

    // Detect when installed
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        notifyInstallListeners();
        console.log('[PWA] Aplikasi Dinasti Nasrukhan berhasil diinstal!');
    });

    // Register SW on window load
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('[PWA] Service Worker registered with scope:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('[PWA] Versi baru aplikasi tersedia!');
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.warn('[PWA] Service Worker registration failed:', error);
            });
    });
}

function notifyInstallListeners() {
    installListeners.forEach((listener) => {
        try {
            listener();
        } catch (e) {
            console.error(e);
        }
    });
}

export function subscribeToInstallPrompt(callback: () => void): () => void {
    installListeners.add(callback);
    return () => {
        installListeners.delete(callback);
    };
}

export function canPromptNativeInstall(): boolean {
    return deferredPrompt !== null;
}

export async function promptNativeInstall(): Promise<'accepted' | 'dismissed' | null> {
    if (!deferredPrompt) {
        return null;
    }

    try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('[PWA] Pengguna menyetujui instalasi PWA.');
        } else {
            console.log('[PWA] Pengguna membatalkan instalasi PWA.');
        }
        deferredPrompt = null;
        notifyInstallListeners();
        return outcome;
    } catch (err) {
        console.error('[PWA] Error during prompt:', err);
        return null;
    }
}
