"use client"

import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCoin, IconPercentage, IconAlertCircle, IconUsers, IconCalendar, IconDeviceMobile } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminDashboard() {
    const { currentUser, members, transactions } = useAppStore()

    if (!currentUser) return <div className="flex h-96 items-center justify-center">กรุณาเข้าสู่ระบบก่อน</div>

    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'
    
    // Filter members: Super Admin sees all, Admin sees only their own
    const myMembers = isSuperAdmin ? members : members.filter(m => m.adminId === currentUser.id)
    const myTransactions = isSuperAdmin ? transactions : transactions.filter(t => t.adminId === currentUser.id)

    const totalPrincipal = myMembers.reduce((sum, m) => sum + m.loanAmount, 0)
    const totalPayments = myTransactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.amount, 0)

    const overdueMembers = myMembers.filter(m => m.status === 'OVERDUE').length
    const pendingApproval = myMembers.filter(m => m.status === 'PENDING_APPROVAL').length

    const stats = [
        {
            title: isSuperAdmin ? "ยอดปล่อยกู้ทั้งหมด" : "ยอดเงินต้นที่ปล่อยกู้",
            value: `฿${totalPrincipal.toLocaleString()}`,
            icon: IconCoin,
            description: "ยอดรวมเงินต้นที่ปล่อยออกไป",
            color: "text-blue-600"
        },
        {
            title: "เก็บยอดไปแล้ว",
            value: `฿${totalPayments.toLocaleString()}`,
            icon: IconCoin,
            description: "ยอดเงินรวมที่รับชำระแล้ว",
            color: "text-green-600"
        },
        {
            title: "ลูกหนี้ค้างชำระ",
            value: overdueMembers,
            icon: IconAlertCircle,
            description: "รายชื่อที่ทำเครื่องหมายค้างชำระ",
            alert: overdueMembers > 0,
            color: "text-red-600"
        },
        {
            title: "รออนุมัติ",
            value: pendingApproval,
            icon: IconUsers,
            description: "ลูกหนี้ใหม่รอการอนุมัติ",
            color: "text-amber-600"
        }
    ]

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">ภาพรวมระบบ</h2>
                <p className="text-muted-foreground">สวัสดีคุณ {currentUser.name} ({currentUser.role})</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <IconUsers className="size-5" />
                            ลูกหนี้ล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {myMembers.length > 0 ? (
                            myMembers.slice(0, 5).map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{member.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <IconDeviceMobile className="size-3" />
                                                {member.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm font-semibold">฿{member.loanAmount.toLocaleString()}</span>
                                        <Badge variant={member.status === 'OVERDUE' ? 'destructive' : member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {member.status === 'OVERDUE' ? 'ค้างชำระ' : member.status === 'ACTIVE' ? 'ปกติ' : 'รออนุมัติ'}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">ไม่มีข้อมูลลูกหนี้</div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <IconCalendar className="size-5" />
                            รายการธุรกรรมล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {myTransactions.length > 0 ? (
                            myTransactions.slice(0, 5).map((tx) => {
                                const member = members.find(m => m.id === tx.memberId)
                                return (
                                    <div key={tx.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{member?.name || 'Unknown'}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString('th-TH')} - {tx.note}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-semibold text-green-600">+฿{tx.amount.toLocaleString()}</span>
                                            <Badge variant={tx.status === 'APPROVED' ? 'default' : tx.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                                {tx.status === 'APPROVED' ? 'สำเร็จ' : tx.status === 'PENDING' ? 'รอตรวจสอบ' : 'ถูกปฏิเสธ'}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">ไม่มีรายการธุรกรรม</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

