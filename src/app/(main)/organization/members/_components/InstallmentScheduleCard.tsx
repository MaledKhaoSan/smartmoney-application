"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconCash, IconBuildingBank, IconClockHour8 } from "@tabler/icons-react"

interface Installment {
    installmentNumber: number
    dueDate: Date
    expectedAmount: number
    actualPaid: number
    status: string
    paymentMethods?: ('CASH' | 'BANKING')[]
}

interface InstallmentScheduleCardProps {
    installmentsSchedule: Installment[]
    totalInstallments: number
}

export function InstallmentScheduleCard({ installmentsSchedule, totalInstallments }: InstallmentScheduleCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ตารางผ่อนชำระ ({totalInstallments} งวด)</CardTitle>
                <CardDescription>สถานะการจ่ายเงินแต่ละงวด (คำนวณจากยอดชำระสะสม)</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24 md:w-16">
                                <span className="md:hidden">งวด/วันที่</span>
                                <span className="hidden md:inline">งวดที่</span>
                            </TableHead>
                            <TableHead className="hidden md:table-cell">วันที่ครบกำหนด</TableHead>
                            <TableHead className="text-right">
                                <span className="md:hidden">ยอดชำระ</span>
                                <span className="hidden md:inline">ยอดที่ต้องชำระ</span>
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-right">ยอดที่จ่ายแล้ว</TableHead>
                            <TableHead className="text-center w-24 md:w-32">สถานะ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {installmentsSchedule.map((inst) => (
                            <TableRow key={inst.installmentNumber}>
                                <TableCell className="font-medium py-3">
                                    <div className="flex items-center gap-3">
                                        {/* Status Indicator Circle */}
                                        {inst.status === 'PAID' && inst.actualPaid === 0 ? (
                                            <div className="shrink-0 size-9 md:size-10 rounded-lg overflow-hidden flex items-center justify-center text-xs md:text-sm">
                                                <div className="size-5 bg-slate-500 w-px absolute h-32 z-10"></div>
                                            </div>
                                        ) : (
                                            <div className="shrink-0 size-9 md:size-10 rounded-lg overflow-hidden flex items-center justify-center text-xs md:text-sm font-bold border transition-colors bg-white">
                                                <div className="w-full h-full flex items-center justify-center z-20">
                                                    {inst.paymentMethods?.includes('CASH') && (
                                                        <div className="bg-linear-180 from-[#A8F8C9] to-[#6FAD89] w-full h-full flex flex-col items-center justify-center text-black leading-none">
                                                            <IconCash className="size-5 text-black" title="เงินสด" />
                                                        </div>
                                                    )}
                                                    {inst.paymentMethods?.includes('BANKING') && (
                                                        <div className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] w-full h-full flex flex-col items-center justify-center text-black leading-none">
                                                            <IconBuildingBank className="size-5 text-black" title="โอนผ่านธนาคาร" />
                                                        </div>
                                                    )}
                                                    {(!inst.paymentMethods || inst.paymentMethods.length === 0) && (
                                                        <div className="bg-linear-180 from-[#DCDEE9] to-[#AEB0B8] w-full h-full flex flex-col items-center justify-center text-black leading-none">
                                                            <IconClockHour8 className="size-5 text-muted" title="ยังไม่ชำระ" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}


                                        <div className="flex flex-col min-w-0">
                                            <div className="hidden md:block font-bold text-slate-700">งวดที่ {inst.installmentNumber}</div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {/* Mobile Date */}
                                                <span className="md:hidden text-[10px] font-normal text-muted-foreground truncate">
                                                    <div className="md:hidden text-[10px] text-slate-700">งวดที่ {inst.installmentNumber}</div>
                                                    {inst.dueDate.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{inst.dueDate.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}</TableCell>
                                <TableCell className="text-right">
                                    {/* Desktop View */}
                                    <div className="hidden md:block">
                                        ฿{inst.expectedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    {/* Mobile View */}
                                    <div className="md:hidden flex flex-col items-end gap-0">
                                        {inst.status === 'PAID' && inst.actualPaid === 0 ? (
                                            <div className="text-[10px] font-bold text-muted-foreground">ชำระแล้ว (จ่ายรวบ)</div>
                                        ) : (
                                            <>
                                                <div className="text-[9px] text-muted-foreground line-through decoration-slate-300">
                                                    ฿{inst.expectedAmount.toLocaleString()}
                                                </div>
                                                <div className={`text-[11px] font-bold ${inst.status === 'OVERDUE' ? 'text-muted-foreground' : 'text-primary'}`}>
                                                    ฿{inst.actualPaid.toLocaleString()}
                                                </div>
                                                {inst.status === 'PARTIAL' && (
                                                    <div className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">
                                                        ขาดอีก ฿{(inst.expectedAmount - inst.actualPaid).toLocaleString()}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right">
                                    <div className="flex flex-col items-end gap-0.5">
                                        {inst.status === 'PAID' && inst.actualPaid === 0 ? (
                                            <div className="text-xs font-bold text-muted-foreground">ชำระแล้ว (จ่ายรวบ)</div>
                                        ) : (
                                            <>
                                                {inst.actualPaid > 0 ? (
                                                    <div className={`text-sm font-bold ${inst.actualPaid > inst.expectedAmount ? "text-green-600" : "text-slate-700"}`}>
                                                        ฿{inst.actualPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                ) : inst.status === 'OVERDUE' ? (
                                                    <div className="text-sm font-bold text-red-600">฿0.00</div>
                                                ) : (
                                                    <div className="text-muted-foreground">-</div>
                                                )}

                                                {inst.status === 'PARTIAL' && inst.actualPaid < inst.expectedAmount && (
                                                    <div className="text-[10px] text-yellow-600 font-medium">
                                                        ขาดอีก ฿{(inst.expectedAmount - inst.actualPaid).toLocaleString()}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="scale-90 md:scale-100 origin-center">
                                        {inst.status === 'PAID' && (
                                            <>
                                                <Badge variant="outline" className=" rounded-lg px-4 text-xs">
                                                    จ่ายแล้ว
                                                </Badge>
                                                {inst.paymentMethods?.includes('CASH') && (
                                                    <p className="text-[10px] text-slate-500">
                                                        ผ่านเงินสด
                                                    </p>
                                                )}
                                                {inst.paymentMethods?.includes('BANKING') && (
                                                    <p className="text-[10px] text-slate-500">
                                                        ผ่านบัญชีธนาคาร
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {inst.status === 'PARTIAL' && (
                                            <Badge variant="outline" className=" rounded-lg px-4 text-xs">
                                                บางส่วน
                                            </Badge>
                                        )}
                                        {inst.status === 'UNPAID' && (
                                            <Badge variant="outline" className=" rounded-lg px-4 text-xs">
                                                ยังไม่ถึงกำหนด
                                            </Badge>
                                        )}
                                        {inst.status === 'OVERDUE' && (
                                            <Badge variant="outline" className=" rounded-lg px-4 text-xs">
                                                ค้างชำระ
                                            </Badge>
                                        )}
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
