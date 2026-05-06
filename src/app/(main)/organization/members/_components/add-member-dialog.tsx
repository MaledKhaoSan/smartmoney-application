"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { IconPlus, IconArrowLeft } from "@tabler/icons-react"
import { Member, User } from "@/types"
import { useIsMobile } from "@/hooks/use-mobile"
import { MemberForm } from "./member-form"

interface AddMemberDialogProps {
    currentUser: User
    addMember: (member: Member) => void
}

export function AddMemberDialog({ currentUser, addMember }: AddMemberDialogProps) {
    const isMobile = useIsMobile()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setIsDialogOpen(true)
        }
    }, [searchParams])

    const TriggerButton = (
        <Button className="w-8 h-8 md:w-auto md:h-10 bg-primary hover:bg-primary/90 shadow-lg rounded-lg md:rounded-md p-0 md:px-4 flex items-center justify-center">
            <IconPlus className="md:mr-2 h-5 w-5 shrink-0" />
            <span className="hidden md:inline text-sm font-medium">เพิ่มลูกหนี้ใหม่</span>
        </Button>
    )

    if (isMobile) {
        return (
            <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <SheetTrigger asChild>
                    {TriggerButton}
                </SheetTrigger>
                <SheetContent side="left" className="min-w-full p-0 flex flex-col border-none" showCloseButton={false}>
                    <div className="relative flex items-center justify-center px-4 py-4 border-b">
                        <Button variant="ghost" size="icon" className="absolute left-4 h-8 w-8 mx-0 rounded-full" onClick={() => setIsDialogOpen(false)}>
                            <IconArrowLeft className="text-muted-foreground size-5" />
                        </Button>
                        <SheetHeader>
                            <SheetTitle className="text-lg font-bold text-center">ลงทะเบียนลูกหนี้ใหม่</SheetTitle>
                        </SheetHeader>
                    </div>
                    <MemberForm
                        currentUser={currentUser}
                        addMember={addMember}
                        onSuccess={() => setIsDialogOpen(false)}
                    />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {TriggerButton}
            </DialogTrigger>
            <DialogContent className="w-full max-w-full md:max-w-[500px] p-0 overflow-hidden flex flex-col sm:h-auto sm:max-h-[90vh] max-sm:rounded-none">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold">ลงทะเบียนลูกหนี้ใหม่</DialogTitle>
                </DialogHeader>
                <MemberForm
                    currentUser={currentUser}
                    addMember={addMember}
                    onSuccess={() => setIsDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
