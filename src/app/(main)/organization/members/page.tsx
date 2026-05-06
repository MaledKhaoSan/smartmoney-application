"use client"

import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Member, LoanInterestType } from "@/types"
import { IconPlus, IconTrash, IconEdit, IconSearch, IconFilter, IconEye, IconChartBar } from "@tabler/icons-react"
import { toast } from "sonner"
import Link from "next/link"
import { AddMemberDialog } from "./_components/add-member-dialog"

export default function MemberManagementPage() {
    const { currentUser, users, members, addMember, deleteMember } = useAppStore()
    const [searchQuery, setSearchQuery] = useState("")

    if (!currentUser) return null

    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'

    // Filter members: Super Admin sees all, Admin sees only their own
    const filteredMembers = (isSuperAdmin ? members : members.filter(m => m.adminId === currentUser.id))
        .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery))

    const handleDelete = (id: string) => {
        if (confirm('ยืนยันการลบข้อมูลลูกหนี้?')) {
            deleteMember(id)
            toast.success("ลบข้อมูลเรียบร้อย")
        }
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'ACTIVE': return { label: 'ปกติ' };
            case 'OVERDUE': return { label: 'ค้างชำระ' };
            case 'PENDING_APPROVAL': return { label: 'รออนุมัติ' };
            case 'CLOSED': return { label: 'ปิดยอดแล้ว' };
            default: return { label: status };
        }
    }

    return (
        <div className="space-y-6 lg:px-4">
            <div className="px-2 md:px-0 py-5 flex flex-row items-center justify-between gap-2">
                <div className="flex flex-col items-start justify-between">
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">รายชื่อลูกหนี้</h2>
                    <p className="text-xs md:text-base text-muted-foreground line-clamp-1 md:line-clamp-none">
                        จัดการข้อมูลและประวัติการกู้ยืม
                    </p>
                </div>
                <div>
                    <AddMemberDialog currentUser={currentUser} addMember={addMember} />
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>ลูกหนี้ทั้งหมด ({filteredMembers.length})</CardTitle>
                        <div className="relative w-full md:w-72">
                            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="ค้นหาชื่อหรือเบอร์โทร..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ลูกหนี้</TableHead>
                                <TableHead className="hidden md:table-cell">เบอร์โทร</TableHead>
                                {isSuperAdmin && <TableHead className="hidden md:table-cell">ผู้ดูแล</TableHead>}
                                <TableHead className="hidden md:table-cell">ยอดเงินกู้</TableHead>
                                <TableHead>ยอดกู้/ชำระ</TableHead>
                                <TableHead className="hidden md:table-cell">สถานะ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => {
                                    const statusInfo = getStatusInfo(member.status);
                                    const admin = users.find(u => u.id === member.adminId);
                                    const totalAmount = member.loanAmount + (member.loanAmount * member.interestRate / 100) * member.totalInstallments;

                                    return (
                                        <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="md:hidden mt-1">
                                                        <Badge variant="default" className="text-[8px] px-1.5 py-0.5 h-fit min-w-fit leading-none">
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                    <Link href={`/organization/members/detail/${member.id}`} className="hover:text-primary hover:underline transition-colors line-clamp-1">
                                                        {member.name}
                                                    </Link>
                                                    <span className="text-[10px] text-muted-foreground md:hidden">{member.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                                            {isSuperAdmin && (
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">{admin?.name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell className="hidden md:table-cell font-semibold text-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-muted-foreground">ต้น: ฿{member.loanAmount.toLocaleString()}</span>
                                                    <span className="text-primary text-sm font-bold">รวม: ฿{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold md:text-sm">฿{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{member.paidInstallments}/{member.totalInstallments} งวด</span>
                                                        <div className="w-10 sm:w-12 bg-secondary h-1 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-primary h-full transition-all"
                                                                style={{ width: `${(member.paidInstallments / member.totalInstallments) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="default">
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right p-1 md:p-4">
                                                <div className="flex justify-end items-center -space-x-1 md:space-x-1">
                                                    <Link href={`/organization/members/detail/${member.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                                                            <IconEye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex hover:bg-blue-50 hover:text-blue-600">
                                                        <IconEdit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="h-8 w-8 hover:bg-red-50 text-red-500">
                                                        <IconTrash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={isSuperAdmin ? 7 : 6} className="h-24 text-center text-muted-foreground">
                                        ไม่พบข้อมูลลูกหนี้
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

