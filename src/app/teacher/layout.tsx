import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TeacherNav } from "@/components/dashboard/teacher-nav";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout navItems={<TeacherNav />}>
            <Suspense fallback={<DashboardLoading />}>
                {children}
            </Suspense>
        </DashboardLayout>
    );
}

function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
             </div>
             <Skeleton className="h-64 rounded-lg" />
        </div>
    )
}
