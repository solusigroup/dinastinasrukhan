import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    TreesIcon,
    Images,
    BookOpen,
    Shield,
    UserCog,
    MessageSquare,
    Download,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { PwaInstallDialog } from '@/components/pwa-install-dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Pesan / Chat',
        href: '/chat',
        icon: MessageSquare,
    },
    {
        title: 'Galeri Keluarga',
        href: '/gallery',
        icon: Images,
    },
    {
        title: 'Anggota Keluarga',
        href: '/family-members',
        icon: Users,
    },
    {
        title: 'Pohon Keluarga',
        href: '/family-tree',
        icon: TreesIcon,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const [installDialogOpen, setInstallDialogOpen] = useState(false);

    // Check superadmin status from server-side flag
    const isSuperadmin = auth?.user?.is_superadmin === true;
    const isViewer = auth?.user?.role === 'viewer';
    const canChat = auth?.user?.can_chat ?? (!isViewer && auth?.user?.role !== 'pending');

    // Build the nav list
    const navItems = [];

    // Show admin menu items for superadmin users
    if (isSuperadmin) {
        navItems.push({
            title: 'Kelola Pengguna',
            href: '/admin/users',
            icon: Shield,
        });
        navItems.push({
            title: 'Kelola Role',
            href: '/admin/users?status=active',
            icon: Shield,
        });
    }

    // Filter main nav items (hide chat for viewers)
    const filteredMainNavItems = mainNavItems.filter((item) => {
        if (item.href === '/chat' && !canChat) {
            return false;
        }
        return true;
    });

    // Then main nav
    navItems.push(...filteredMainNavItems);

    const footerNavItems: NavItem[] = [
        {
            title: 'Panduan',
            href: '/panduan.html',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={navItems}
                    label={isSuperadmin ? 'Menu Admin' : 'Menu'}
                />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setInstallDialogOpen(true)}
                            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                        >
                            <Download className="h-4 w-4" />
                            <span>Instal Aplikasi (PWA)</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
                <PwaInstallDialog
                    open={installDialogOpen}
                    onOpenChange={setInstallDialogOpen}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
