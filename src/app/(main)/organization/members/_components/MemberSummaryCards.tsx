"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCash, IconReceiptTax, IconCalculator, IconCreditCard } from "@tabler/icons-react"

interface MemberSummaryCardsProps {
    loanAmount: number
    interestRate: number
    interestType: string
    totalInterest: number
    totalPayable: number
    remainingAmount: number
}

export function MemberSummaryCards({
    loanAmount,
    interestRate,
    interestType,
    totalInterest,
    totalPayable,
    remainingAmount
}: MemberSummaryCardsProps) {
    return (
        <div className="px-2 grid grid-cols-4 gap-2 md:gap-4">
            <Card className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] border-none shadow-sm overflow-hidden">
                <CardHeader className="p-0 md:p-5 flex flex-col items-center justify-center">
                    <CardDescription className="flex flex-col items-center justify-center gap-0.5 text-white/80 text-[9px] md:text-xs pb-1 md:pb-3">
                        <IconCash className="h-7 w-7 md:h-7 md:w-7 text-white" />
                        <span className="leading-tight font-medium text-white">ยอดเงินกู้</span>
                    </CardDescription>
                    <CardTitle className="text-xs md:text-2xl font-bold text-white leading-none tracking-tight">฿{loanAmount.toLocaleString()}</CardTitle>
                </CardHeader>
            </Card>
            <Card className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] border-none shadow-sm overflow-hidden">
                <CardHeader className="p-0 md:p-5 flex flex-col items-center justify-center">
                    <CardDescription className="flex flex-col items-center justify-center gap-0.5 text-white/80 text-[9px] md:text-xs pb-1 md:pb-3">
                        <IconReceiptTax className="h-7 w-7 md:h-7 md:w-7 text-white" />
                        <span className="leading-tight font-medium text-white">รวมดอกเบี้ย</span>
                    </CardDescription>
                    <CardTitle className="text-xs md:text-2xl font-bold text-white leading-none tracking-tight">฿{totalInterest.toLocaleString()}</CardTitle>
                </CardHeader>
            </Card>
            <Card className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] border-none shadow-sm overflow-hidden">
                <CardHeader className="p-0 md:p-5 flex flex-col items-center justify-center">
                    <CardDescription className="flex flex-col items-center justify-center gap-0.5 text-white/80 text-[9px] md:text-xs pb-1 md:pb-3">
                        <IconCalculator className="h-7 w-7 md:h-7 md:w-7 text-white" />
                        <span className="leading-tight font-medium text-white">ยอดที่ต้องชำระ</span>
                    </CardDescription>
                    <CardTitle className="text-xs md:text-2xl font-bold text-white leading-none tracking-tight">฿{totalPayable.toLocaleString()}</CardTitle>
                </CardHeader>
            </Card>
            <Card className="bg-linear-180 from-[#E4CBFF] to-[#996DFB] border-none shadow-sm overflow-hidden">
                <CardHeader className="p-0 md:p-5 flex flex-col items-center justify-center">
                    <CardDescription className="flex flex-col items-center justify-center gap-0.5 text-white/80 text-[9px] md:text-xs pb-1 md:pb-3">
                        <IconCreditCard className="h-7 w-7 md:h-7 md:w-7 text-white" />
                        <span className="leading-tight font-medium text-white">ยอดคงเหลือ</span>
                    </CardDescription>
                    <CardTitle className="text-xs md:text-2xl font-bold text-white leading-none tracking-tight">฿{remainingAmount.toLocaleString()}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
