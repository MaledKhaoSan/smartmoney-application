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
import { IconPlus, IconTrash, IconEdit, IconSearch, IconFilter } from "@tabler/icons-react"
import { toast } from "sonner"

export default function MemberManagementPage() {
    const { currentUser, users, members, addMember, deleteMember } = useAppStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        loanAmount: '',
        interestRate: '',
        interestType: 'DAILY',
        totalInstallments: '24'
    })

    if (!currentUser) return null

    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'
    
    // Filter members: Super Admin sees all, Admin sees only their own
    const filteredMembers = (isSuperAdmin ? members : members.filter(m => m.adminId === currentUser.id))
        .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newMember: Member = {
            id: `mem_${Date.now()}`,
            adminId: currentUser.id,
            name: formData.name,
            phone: formData.phone,
            loanAmount: Number(formData.loanAmount),
            interestRate: Number(formData.interestRate),
            interestType: formData.interestType as LoanInterestType,
            totalInstallments: Number(formData.totalInstallments),
            paidInstallments: 0,
            status: 'ACTIVE',
            loanDate: new Date().toISOString()
        }
        addMember(newMember)
        setIsDialogOpen(false)
        toast.success("เพิ่มข้อมูลลูกหนี้เรียบร้อยแล้ว")
        setFormData({
            name: '', phone: '', loanAmount: '', interestRate: '', interestType: 'DAILY', totalInstallments: '24'
        })
    }

    const handleDelete = (id: string) => {
        if (confirm('ยืนยันการลบข้อมูลลูกหนี้?')) {
            deleteMember(id)
            toast.success("ลบข้อมูลเรียบร้อย")
        }
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'ACTIVE': return { label: 'ปกติ', variant: 'default' };
            case 'OVERDUE': return { label: 'ค้างชำระ', variant: 'destructive' };
            case 'PENDING_APPROVAL': return { label: 'รออนุมัติ', variant: 'secondary' };
            case 'CLOSED': return { label: 'ปิดยอดแล้ว', variant: 'outline' };
            default: return { label: status, variant: 'outline' };
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold tracking-tight">รายชื่อลูกหนี้</h2>
                    <p className="text-muted-foreground">จัดการข้อมูลและประวัติการกู้ยืมของลูกหนี้ทั้งหมด</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            <IconPlus className="mr-2 h-5 w-5" /> เพิ่มลูกหนี้ใหม่
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>ลงทะเบียนลูกหนี้ใหม่</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                                <Input id="name" placeholder="ระบุชื่อลูกหนี้" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                                <Input id="phone" placeholder="08x-xxx-xxxx" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">ยอดเงินกู้ (บาท)</Label>
                                    <Input id="amount" type="number" value={formData.loanAmount} onChange={e => setFormData({ ...formData, loanAmount: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="inst">จำนวนงวด</Label>
                                    <Input id="inst" type="number" value={formData.totalInstallments} onChange={e => setFormData({ ...formData, totalInstallments: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rate">ดอกเบี้ย</Label>
                                <div className="flex gap-2">
                                    <Input id="rate" type="number" step="0.1" value={formData.interestRate} onChange={e => setFormData({ ...formData, interestRate: e.target.value })} placeholder="อัตราดอกเบี้ย" required />
                                    <Select value={formData.interestType} onValueChange={(val) => setFormData({ ...formData, interestType: val })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DAILY">ต่อวัน</SelectItem>
                                            <SelectItem value="MONTHLY">ต่อเดือน</SelectItem>
                                            <SelectItem value="FIXED">ยอดคงที่</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-2" size="lg">สร้างรายการกู้ยืม</Button>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                <TableHead>ชื่อลูกหนี้</TableHead>
                                <TableHead>เบอร์โทร</TableHead>
                                {isSuperAdmin && <TableHead>ผู้ดูแล</TableHead>}
                                <TableHead>ยอดเงินกู้</TableHead>
                                <TableHead>การชำระ (งวด)</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => {
                                    const statusInfo = getStatusInfo(member.status);
                                    const admin = users.find(u => u.id === member.adminId);
                                    
                                    return (
                                        <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.phone}</TableCell>
                                            {isSuperAdmin && (
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">{admin?.name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell className="font-semibold">฿{member.loanAmount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 w-24">
                                                    <span className="text-xs">{member.paidInstallments} / {member.totalInstallments} งวด</span>
                                                    <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                                                        <div 
                                                            className="bg-primary h-full transition-all" 
                                                            style={{ width: `${(member.paidInstallments / member.totalInstallments) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusInfo.variant as any}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                                                    <IconEdit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="hover:bg-red-50 text-red-500">
                                                    <IconTrash className="h-4 w-4" />
                                                </Button>
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

