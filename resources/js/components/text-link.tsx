import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'font-bold text-gray-900 underline decoration-2 decoration-gray-900 underline-offset-4 transition-colors hover:text-blue-600 hover:decoration-blue-600',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
