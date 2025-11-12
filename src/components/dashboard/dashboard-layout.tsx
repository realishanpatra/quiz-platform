import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from './user-menu';
import { Logo } from '../ui/logo';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children, navItems }: { children: React.ReactNode, navItems: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <Sidebar side="left" variant="sidebar" collapsible="icon" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                    <SidebarHeader>
                        <div className={cn("flex items-center gap-2 p-2",
                            "group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:justify-center"
                        )}>
                             <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-primary")}>
                                <Logo />
                            </div>
                            <span className="font-headline text-lg font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">QuizVerse</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        {navItems}
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
                        <div className="flex items-center gap-2">
                           <SidebarTrigger className="lg:hidden"/>
                           <h1 className="text-xl font-headline font-semibold">Dashboard</h1>
                        </div>
                        <UserMenu />
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

const SidebarLogo = () => (
    <div className={cn("flex items-center gap-2 p-2",
        "group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:justify-center"
    )}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-primary")}>
            <Logo />
        </div>
        <span className="font-headline text-lg font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">QuizVerse</span>
    </div>
)
