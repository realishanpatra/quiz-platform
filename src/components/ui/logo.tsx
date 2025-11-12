import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-primary")}>
                <BookOpenCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-headline text-xl font-bold">QuizVerse</span>
        </div>
    );
}
