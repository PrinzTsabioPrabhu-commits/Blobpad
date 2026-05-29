import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavItemWithColor extends NavItem {
    color?: string;
    textColor?: string;
}

export function NavMain({ items = [] }: { items: NavItemWithColor[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarMenu className="space-y-2">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    const bgColor = item.color || 'bg-gray-200';
                    const textColor = item.textColor || 'text-gray-900';

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: item.title }}
                                className={`mx-1 rounded-xl border-3 border-gray-900 transition-all ${
                                    isActive
                                        ? `${bgColor} ${textColor} font-black shadow-lg`
                                        : `bg-white font-bold text-gray-900 hover:shadow-md`
                                } hover:-translate-y-0.5`}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex items-center gap-3"
                                >
                                    {item.icon && (
                                        <item.icon
                                            strokeWidth={3}
                                            className={`h-5 w-5 shrink-0 ${isActive ? textColor : 'text-gray-700'}`}
                                        />
                                    )}
                                    <span className="truncate group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
