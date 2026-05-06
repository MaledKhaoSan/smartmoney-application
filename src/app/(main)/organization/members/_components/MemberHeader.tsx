"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconPhone } from "@tabler/icons-react"

interface MemberHeaderProps {
    member: {
        name: string
        phone: string
        status: string
    }
    onBack: () => void
}

export function MemberHeader({ member, onBack }: MemberHeaderProps) {
    return (
        <div className="flex flex-row items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
                <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold tracking-tight">{member.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <IconPhone className="h-4 w-4" />
                    <span>{member.phone}</span>
                    <span className="mx-1">•</span>
                    <Badge variant={member.status === 'ACTIVE' ? 'default' : 'destructive'}>
                        {member.status === 'ACTIVE' ? 'ปกติ' : 'ค้างชำระ'}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
