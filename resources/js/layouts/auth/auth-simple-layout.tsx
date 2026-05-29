import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#FFFDF4] p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8 rounded-2xl border-4 border-gray-900 bg-white p-8 shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-4 border-gray-900 bg-[#FDC700] shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-transform hover:scale-110">
                                <span className="text-xl font-black text-gray-900">
                                    C
                                </span>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-black tracking-tight text-gray-900">
                                {title}
                            </h1>
                            <p className="text-center text-sm font-medium text-gray-700">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
