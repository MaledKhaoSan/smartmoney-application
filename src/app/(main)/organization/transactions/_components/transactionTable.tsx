import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    IconCalendar,
    IconPlus,
    IconTrash,
    IconEdit,
    IconCash,
    IconBuildingBank,
    IconClockHour8,
    IconHistory
} from "@tabler/icons-react"

// Mock Transactions Data
const mockTransactions = [
    {
        id: "tx1",
        type: "ADD_INSTALLMENT",
        member: "สมชาย ใจดี",
        details: "เพิ่มงวดใหม่ (งวดที่ 25)",
        amount: 500,
        date: new Date(),
        status: "SUCCESS",
    },
    {
        id: "tx2",
        type: "PAYMENT_CASH",
        member: "สมหญิง รักดี",
        details: "ชำระงวดที่ 5",
        amount: 1200,
        date: new Date(Date.now() - 3600000),
        status: "SUCCESS",
    },
    {
        id: "tx3",
        type: "EDIT_INSTALLMENT",
        member: "วิชัย มานะ",
        details: "แก้ไขยอดงวดที่ 10",
        amount: 0,
        date: new Date(Date.now() - 86400000),
        status: "SUCCESS",
    },
    {
        id: "tx4",
        type: "DELETE_INSTALLMENT",
        member: "มานี ชูใจ",
        details: "ลบงวดที่ 12 (ผิดพลาด)",
        amount: -500,
        date: new Date(Date.now() - 172800000),
        status: "SUCCESS",
    },
    {
        id: "tx5",
        type: "PAYMENT_BANK",
        member: "สมชาย ใจดี",
        details: "ชำระงวดที่ 6",
        amount: 500,
        date: new Date(Date.now() - 259200000),
        status: "PENDING",
    }
]

export function TransactionTable() {
    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <IconHistory className="size-6 text-primary" />
                    </div>
                    ประวัติธุรกรรมทั้งหมด
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-24 md:w-16">ประเภท</TableHead>
                            <TableHead>รายละเอียด / สมาชิก</TableHead>
                            <TableHead className="hidden md:table-cell">วันที่/เวลา</TableHead>
                            <TableHead className="text-right">จำนวนเงิน</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTransactions.map((tx) => (
                            <TableRow key={tx.id} className="group transition-colors hover:bg-slate-50/50">
                                <TableCell className="py-4">
                                    <div className="shrink-0 size-10 rounded-xl overflow-hidden flex items-center justify-center border transition-all group-hover:scale-105 shadow-sm">
                                        {tx.type === 'ADD_INSTALLMENT' && (
                                            <div className="bg-linear-180 from-[#A8F8C9] to-[#6FAD89] w-full h-full flex items-center justify-center text-white">
                                                <IconPlus className="size-6" />
                                            </div>
                                        )}
                                        {tx.type === 'DELETE_INSTALLMENT' && (
                                            <div className="bg-linear-180 from-[#FFD1D1] to-[#F87171] w-full h-full flex items-center justify-center text-white">
                                                <IconTrash className="size-6" />
                                            </div>
                                        )}
                                        {tx.type === 'EDIT_INSTALLMENT' && (
                                            <div className="bg-linear-180 from-[#FFEBB7] to-[#FBBF24] w-full h-full flex items-center justify-center text-white">
                                                <IconEdit className="size-6" />
                                            </div>
                                        )}
                                        {tx.type === 'PAYMENT_CASH' && (
                                            <div className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] w-full h-full flex items-center justify-center text-white">
                                                <IconCash className="size-6" />
                                            </div>
                                        )}
                                        {tx.type === 'PAYMENT_BANK' && (
                                            <div className="bg-linear-180 from-[#BFDBFE] to-[#3B82F6] w-full h-full flex items-center justify-center text-white">
                                                <IconBuildingBank className="size-6" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="font-bold text-slate-700">{tx.details}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <span className="font-medium text-slate-500">{tx.member}</span>
                                            <span className="md:hidden">• {tx.date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex flex-col text-sm">
                                        <div className="font-medium text-slate-600">
                                            {tx.date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {tx.date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : tx.amount < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                        {tx.amount === 0 ? '-' : `฿${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}