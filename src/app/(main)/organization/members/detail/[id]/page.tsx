"use client"

import { useParams, useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChartConfig } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconWallet, IconCoin, IconCreditCard, IconTrendingUp, IconChartPie } from "@tabler/icons-react"

import { MemberHeader } from "../../_components/MemberHeader"
import { PaymentTrendCard } from "../../_components/PaymentTrendCard"
import { DebtRatioCard } from "../../_components/DebtRatioCard"
import { MemberGradeCard } from "../../_components/MemberGradeCard"
import { MemberSummaryCards } from "../../_components/MemberSummaryCards"
import { InstallmentScheduleCard } from "../../_components/InstallmentScheduleCard"

export default function MemberDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { members, transactions } = useAppStore()

    const member = members.find(m => m.id === id)
    const memberTransactions = transactions
        .filter(t => t.memberId === id && t.status === 'APPROVED')
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // Calculations
    const {
        paidPercent,
        grade,
        percentile,
        chartData,
        totalPayable,
        remainingAmount,
        installmentsSchedule,
        pieData,
        totalInterest,
        totalPaid
    } = useMemo(() => {
        if (!member) return { paidPercent: 0, grade: 'N/A', percentile: 0, chartData: [], totalPayable: 0, remainingAmount: 0, installmentsSchedule: [], pieData: [], totalInterest: 0, totalPaid: 0 }

        const totalPayable = member.loanAmount + (member.loanAmount * (member.interestRate / 100) * member.totalInstallments)
        const totalPaid = memberTransactions.reduce((sum, t) => sum + t.amount, 0)
        const remainingAmount = Math.max(0, totalPayable - totalPaid)
        const paidPercent = Math.min(100, (totalPaid / totalPayable) * 100)

        // Grade Logic
        let grade = 'D'
        if (paidPercent >= 90) grade = 'A'
        else if (paidPercent >= 60) grade = 'B'
        else if (paidPercent >= 30) grade = 'C'
        if (member.status === 'OVERDUE') grade = 'F'

        // Percentile Logic (Relative to other members)
        const allPaidPercents = members.map(m => {
            const mPayable = m.loanAmount + (m.loanAmount * (m.interestRate / 100) * m.totalInstallments)
            const mTransactions = transactions.filter(t => t.memberId === m.id && t.status === 'APPROVED')
            const mPaid = mTransactions.reduce((sum, t) => sum + t.amount, 0)
            return (mPaid / mPayable) * 100
        }).sort((a, b) => a - b)

        const rank = allPaidPercents.indexOf(paidPercent)
        const percentile = Math.round((rank / allPaidPercents.length) * 100)

        // Chart Data (Cumulative Payment Trend)
        let cumulative = 0
        const chartData = memberTransactions.map(t => {
            cumulative += t.amount
            return {
                date: new Date(t.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
                amount: cumulative,
                payment: t.amount
            }
        })

        // Add a starting point if no transactions
        if (chartData.length === 0) {
            chartData.push({ date: 'เริ่มต้น', amount: 0, payment: 0 })
        }

        // Installment Schedule Logic
        const installmentAmount = totalPayable / member.totalInstallments;
        const installmentsSchedule: any[] = [];
        const loanDate = new Date(member.loanDate);

        // 1. Calculate due dates for all installments first
        const scheduleDates: Date[] = [];
        for (let i = 1; i <= member.totalInstallments; i++) {
            const dueDate = new Date(loanDate);
            if (member.interestType === 'DAILY') {
                dueDate.setDate(dueDate.getDate() + i);
            } else if (member.interestType === 'MONTHLY') {
                dueDate.setMonth(dueDate.getMonth() + i);
            } else {
                dueDate.setMonth(dueDate.getMonth() + i);
            }
            dueDate.setHours(0, 0, 0, 0);
            scheduleDates.push(dueDate);
        }

        // 2. Map transactions to installments based on their created date
        const installmentPayments = new Array(member.totalInstallments).fill(0);
        const installmentMethods = new Array(member.totalInstallments).fill(null).map(() => new Set<'CASH' | 'BANKING'>());

        memberTransactions.forEach(tx => {
            const txDate = new Date(tx.createdAt);
            txDate.setHours(0, 0, 0, 0);

            // Find the first installment whose due date is >= tx date
            let targetIdx = scheduleDates.findIndex(date => date >= txDate);
            if (targetIdx === -1) targetIdx = member.totalInstallments - 1; // Last one if late

            installmentPayments[targetIdx] += tx.amount;

            // Collect methods
            const method = tx.paymentMethod || (tx.slipUrl ? 'BANKING' : 'CASH');
            installmentMethods[targetIdx].add(method as 'CASH' | 'BANKING');
        });

        // 3. Determine status based on cumulative paid amount
        let cumulativePaid = 0;
        for (let i = 0; i < member.totalInstallments; i++) {
            const installmentNumber = i + 1;
            const dueDate = scheduleDates[i];
            const expectedCum = installmentAmount * installmentNumber;

            let status = 'UNPAID';
            if (totalPaid >= expectedCum) {
                status = 'PAID';
            } else if (totalPaid > expectedCum - installmentAmount) {
                status = 'PARTIAL';
            } else {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                if (now > dueDate) {
                    status = 'OVERDUE';
                }
            }

            installmentsSchedule.push({
                installmentNumber,
                dueDate,
                expectedAmount: installmentAmount,
                actualPaid: installmentPayments[i],
                status,
                paymentMethods: Array.from(installmentMethods[i])
            });
        }

        const totalInterest = totalPayable - member.loanAmount
        const interestPaid = Math.min(totalPaid, totalInterest)
        const principalPaid = totalPaid - interestPaid
        const remainingPrincipal = Math.max(0, member.loanAmount - principalPaid)
        const remainingInterest = Math.max(0, totalInterest - interestPaid)

        const pieData = [
            { type: "paid", label: "ชำระแล้ว", value: totalPaid, fill: "var(--color-paid)" },
            { type: "interest", label: "ดอกเบี้ย", value: remainingInterest, fill: "var(--color-interest)" },
            { type: "remaining", label: "ต้นคงเหลือ", value: remainingPrincipal, fill: "var(--color-remaining)" },
        ]

        return { paidPercent, grade, percentile, chartData, totalPayable, remainingAmount, installmentsSchedule, pieData, totalInterest, totalPaid }
    }, [member, memberTransactions, members, transactions])

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-muted-foreground">ไม่พบข้อมูลลูกหนี้</p>
                <Button onClick={() => router.back()}>กลับไปหน้าก่อนหน้า</Button>
            </div>
        )
    }

    const chartConfig = {
        amount: {
            label: "ยอดชำระสะสม",
            color: "var(--chart-1)",
        },
        paid: {
            label: "ชำระแล้ว",
            color: "var(--chart-2)",
        },
        interest: {
            label: "ดอกเบี้ย",
            color: "var(--chart-3)",
        },
        remaining: {
            label: "ต้นคงเหลือ",
            color: "var(--chart-4)",
        },
    } satisfies ChartConfig

    return (
        <div className="space-y-6 pb-10 w-full relative overflow-x-hidden">
            {/* Desktop View */}
            <div className="hidden lg:block space-y-6">
                <MemberHeader member={member} onBack={() => router.back()} />
                <div className="grid grid-cols-3 gap-6">
                    <PaymentTrendCard chartData={chartData} chartConfig={chartConfig} />
                    <DebtRatioCard
                        pieData={pieData}
                        totalPayable={totalPayable}
                        remainingAmount={remainingAmount}
                        chartConfig={chartConfig}
                    />
                    <MemberGradeCard grade={grade} percentile={percentile} paidPercent={paidPercent} />
                </div>
            </div>

            {/* Mobile View */}
            <div className="flex flex-col lg:hidden space-y-6 w-full">
                {/* Unified Mobile Profile Card */}
                <div className="bg-linear-180 from-primary to-[#FAFAFC] p-4 pb-12">

                    <Button variant="ghost" size="icon" className="h-8 w-8 mx-0 mb-6 rounded-full" onClick={() => router.back()}>
                        <IconArrowLeft className="text-white size-5" />
                    </Button>

                    <div className="relative rounded-2xl bg-card border p-5 shadow-sm">
                        {/* Background decoration container - prevents overflow while allowing floating elements outside */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
                        </div>

                        <div className="flex items-start justify-between relative z-10 mb-6">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold">{member.name}</h2>
                                <span className="flex gap-3 justify-start">
                                    <p className="text-xs text-muted-foreground w-7">รหัส:</p>
                                    <p className="text-sm text-muted-foreground">{member.id.substring(0, 8)}</p>
                                </span>
                                <span className="flex gap-3 justify-start">
                                    <p className="text-xs text-muted-foreground w-7">เกรด: </p>
                                    <p className="text-xs">ดีเยี่ยม</p>
                                    <p className="text-xs text-muted-foreground">อันดับที่ {percentile}% ของทั้งหมด</p>
                                </span>
                            </div>

                            <div className="absolute right-0 -top-16 z-20 flex flex-col items-center">
                                <div className="relative flex items-center justify-center">
                                    <div className="bg-white w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center">
                                        <span className="text-5xl font-black text-primary">{grade}</span>
                                    </div>
                                    <div className="absolute -bottom-2 bg-yellow-500 text-black font-bold px-3 py-0.5 rounded-full text-xs shadow-lg">
                                        TOP {100 - percentile}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <IconWallet className="h-4 w-4" />
                                    <span>ยอดกู้รวม:</span>
                                </div>
                                <span className="font-semibold">฿{member.loanAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <IconCoin className="h-4 w-4" />
                                    <span>ยอดจ่ายแล้ว:</span>
                                </div>
                                <span className="font-semibold text-primary">฿{totalPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <IconCreditCard className="h-4 w-4" />
                                    <span>ยอดคงเหลือ:</span>
                                </div>
                                <span className="font-semibold text-destructive">฿{remainingAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="payment" className="w-full px-4 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1.5 rounded-2xl h-16 mb-4 border border-border/40 backdrop-blur-md">
                        <TabsTrigger
                            value="payment"
                            className="flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-all duration-300 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-bold text-muted-foreground"
                        >
                            <IconTrendingUp className="size-5" />
                            <span className="text-[10px] md:text-xs">แนวโน้มการชำระ</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="debt"
                            className="flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-all duration-300 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-bold text-muted-foreground"
                        >
                            <IconChartPie className="size-5" />
                            <span className="text-[10px] md:text-xs">อัตราส่วน</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payment" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <PaymentTrendCard chartData={chartData} chartConfig={chartConfig} />
                    </TabsContent>

                    <TabsContent value="debt" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <DebtRatioCard
                            pieData={pieData}
                            totalPayable={totalPayable}
                            remainingAmount={remainingAmount}
                            chartConfig={chartConfig}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Shared Components (Desktop & Mobile) */}
            <MemberSummaryCards
                loanAmount={member.loanAmount}
                interestRate={member.interestRate}
                interestType={member.interestType}
                totalInterest={totalInterest}
                totalPayable={totalPayable}
                remainingAmount={remainingAmount}
            />

            <InstallmentScheduleCard
                installmentsSchedule={installmentsSchedule}
                totalInstallments={member.totalInstallments}
            />
        </div>
    )
}
