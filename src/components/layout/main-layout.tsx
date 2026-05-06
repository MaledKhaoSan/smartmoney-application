"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/main-app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/layout/mobile-nav"
import { cn } from "@/lib/utils"
import mockData from "@/lib/mock_data.json"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { initialize, isInitialized, currentUser } = useAppStore()
    const isMobile = useIsMobile()

    useEffect(() => {
        // Initialize or update store whenever mock data changes (HMR)
        initialize(mockData as any)
    }, [initialize])

    // Render a simple loading state if not yet initialized
    if (!isInitialized) {
        return <div className="flex h-screen w-full items-center justify-center">Loading Data...</div>
    }

    return (
        <SidebarProvider>
            {!isMobile && <AppSidebar />}
            <SidebarInset className={isMobile ? "pb-20" : ""}>
                {!isMobile && (
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                        <div className="flex items-center gap-2 flex-1">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            ระบบจัดการเงิน
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>แดชบอร์ด</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                        </div>
                        {currentUser && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground hidden md:inline-block">{currentUser.name}</span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.avatar} />
                                    <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </header>
                )}
                <main className="bg-[#FAFAFC] flex flex-1 flex-col gap-4">
                    {children}
                </main>
            </SidebarInset>
            {isMobile && <MobileNav />}
        </SidebarProvider>
    )
}

