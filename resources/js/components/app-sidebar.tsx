import { Link } from '@inertiajs/react';
import { LayoutGrid, FileText, FolderOpen, Star, Trash2, Settings, Tag, Search } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { notes, folders, favorites, tags, search, trash } from '@/lib/routes';
import type { NavItem } from '@/types';

// ============================================================
// MAIN NAVIGATION ITEMS (SIMPLIFIED)
// ============================================================
const mainNavItems: NavItem[] = [
    {
        title: 'Dasbor',
        href: dashboard(),
        icon: LayoutGrid,
        color: 'bg-[#FDC700]',
        textColor: 'text-gray-900',
    },
    {
        title: 'Semua Catatan',
        href: notes(),
        icon: FileText,
        color: 'bg-blue-400',
        textColor: 'text-white',
    },
    {
        title: 'Folder',
        href: folders(),
        icon: FolderOpen,
        color: 'bg-green-400',
        textColor: 'text-gray-900',
    },
];

// ============================================================
// FOOTER NAVIGATION ITEMS
// ============================================================
const footerNavItems: NavItem[] = [
    {
        title: 'Pengaturan',
        href: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-4 border-r-gray-900 bg-[#FFFDF4]">
            {/* ─── HEADER ─── */}
            <SidebarHeader className="border-b-4 border-b-gray-900 bg-[#FDC700] p-3 shadow-md">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-11 rounded-lg border-3 border-gray-900 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ─── CONTENT ─── */}
            <SidebarContent className="flex flex-col gap-3 px-2 py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* ─── FOOTER ─── */}
            <SidebarFooter className="border-t-4 border-t-gray-900 bg-[#FFFDF4] p-3">
                <NavFooter items={footerNavItems} className="mb-3" />
                <div className="border-t-3 border-t-gray-900 pt-3">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
