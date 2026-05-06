"use client"

import { useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCoin, IconPercentage, IconArrowLeft, IconAlertCircle, IconUsers, IconCalendar, IconDeviceMobile, IconChartBar } from "@tabler/icons-react"
import { PaymentStatusPieChart, IncomeTrendAreaChart } from "./_components/dashboard-charts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
    const { currentUser, members, transactions } = useAppStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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

    // Calculate chart data
    const receivedAmount = myTransactions
        .filter(t => t.type === 'PAYMENT' && t.status === 'APPROVED')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalReceivable = myMembers.reduce((acc, m) => {
        const dailyInterest = (m.loanAmount * m.interestRate) / 100
        const totalInterest = dailyInterest * m.totalInstallments
        return acc + m.loanAmount + totalInterest
    }, 0)

    const pendingAmount = Math.max(0, totalReceivable - receivedAmount)

    const isMobile = useIsMobile()

    return (
        <div className="space-y-6 pb-10 relative">
            <div className="z-10 top-0 w-full h-72 bg-linear-180 from-primary to-[#FAFAFC] absolute overflow-hidden pointer-events-none"></div>
            <div className="z-20 relative bg-transparent px-2 md:px-0 py-5 flex flex-row items-center justify-between gap-2">
                <div className="bg-transparent flex flex-col items-start justify-between">
                    <h2 className="text-white text-xl md:text-3xl font-bold tracking-tight">ภาพรวมธุรกรรม</h2>
                    <p className="text-white bg-transparent text-xs md:text-base text-muted-foreground line-clamp-1 md:line-clamp-none">
                        สรุปสถานะการชำระเงินและแนวโน้มรายได้
                    </p>
                </div>

                {isMobile && (
                    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <SheetTrigger asChild>
                            <Button variant="secondary" size="xs" className="flex rounded-full items-center gap-2 border-primary/20 text-primary hover:bg-primary/5">
                                <IconChartBar className="size-4" />
                                <p className="text-xs">สรุปกราฟวิเคราะห์</p>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="min-w-full p-0 flex flex-col border-none" showCloseButton={false}>
                            <div className="relative flex items-center justify-center px-4 py-4 border-b">
                                <Button variant="ghost" size="icon" className="absolute left-4 h-8 w-8 mx-0 rounded-full" onClick={() => setIsDialogOpen(false)}>
                                    <IconArrowLeft className="text-muted-foreground size-5" />
                                </Button>
                                <SheetHeader>
                                    <SheetTitle className="text-lg font-bold text-center">วิเคราะห์ข้อมูลธุรกรรม</SheetTitle>
                                </SheetHeader>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                <PaymentStatusPieChart
                                    collected={receivedAmount}
                                    pending={pendingAmount}
                                />
                                <IncomeTrendAreaChart />
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {!isMobile && (
                <div className="z-20 relative grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <PaymentStatusPieChart
                            collected={receivedAmount}
                            pending={pendingAmount}
                        />
                    </div>
                    <div className="lg:col-span-3 items-start">
                        <IncomeTrendAreaChart />
                    </div>
                </div>
            )}

            <div className="z-20 relative grid gap-3 grid-cols-2 lg:grid-cols-4 pt-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-all border-none bg-white/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-600 line-clamp-1">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} opacity-80`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg md:text-2xl font-bold text-slate-800">
                                {typeof stat.value === 'number' && stat.title.includes('เงิน')
                                    ? `฿${stat.value.toLocaleString()}`
                                    : stat.value.toLocaleString()}
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium line-clamp-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="z-20 grid gap-6 xl:grid-cols-2">
                {/* Recent Members */}
                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <IconUsers className="size-5 text-blue-500" />
                            ลูกหนี้ล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {myMembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="w-[150px]">ชื่อลูกหนี้</TableHead>
                                            <TableHead className="hidden sm:table-cell">เบอร์โทรศัพท์</TableHead>
                                            <TableHead className="text-right">ยอดหนี้</TableHead>
                                            <TableHead className="text-right">สถานะ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myMembers.slice(0, 5).map((member) => (
                                            <TableRow key={member.id} className="border-slate-50 hover:bg-slate-50/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{member.name}</span>
                                                        <span className="text-xs text-muted-foreground sm:hidden flex items-center gap-1 mt-1">
                                                            <IconDeviceMobile className="size-3" />
                                                            {member.phone}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <IconDeviceMobile className="size-3" />
                                                        {member.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">฿{member.loanAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={member.status === 'OVERDUE' ? 'destructive' : member.status === 'ACTIVE' ? 'default' : 'secondary'} className="font-medium whitespace-nowrap">
                                                        {member.status === 'OVERDUE' ? 'ค้างชำระ' : member.status === 'ACTIVE' ? 'ปกติ' : 'รออนุมัติ'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">ไม่มีข้อมูลลูกหนี้</div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <IconCalendar className="size-5 text-emerald-500" />
                            รายการธุรกรรมล่าสุด
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {myTransactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead>ลูกหนี้</TableHead>
                                            <TableHead className="hidden sm:table-cell">รายละเอียด</TableHead>
                                            <TableHead className="text-right">ยอดเงิน</TableHead>
                                            <TableHead className="text-right">สถานะ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myTransactions.slice(0, 5).map((tx) => {
                                            const member = members.find(m => m.id === tx.memberId)
                                            return (
                                                <TableRow key={tx.id} className="border-slate-50 hover:bg-slate-50/50">
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{member?.name || 'Unknown'}</span>
                                                            <span className="text-xs text-muted-foreground sm:hidden mt-1 line-clamp-1">
                                                                {new Date(tx.createdAt).toLocaleDateString('th-TH')} - {tx.note}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                                                        <div className="flex flex-col">
                                                            <span>{new Date(tx.createdAt).toLocaleDateString('th-TH')}</span>
                                                            <span className="line-clamp-1">{tx.note}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-emerald-600">
                                                        +฿{tx.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant={tx.status === 'APPROVED' ? 'default' : tx.status === 'PENDING' ? 'secondary' : 'destructive'} className="font-medium whitespace-nowrap">
                                                            {tx.status === 'APPROVED' ? 'สำเร็จ' : tx.status === 'PENDING' ? 'รอตรวจสอบ' : 'ถูกปฏิเสธ'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">ไม่มีรายการธุรกรรม</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

